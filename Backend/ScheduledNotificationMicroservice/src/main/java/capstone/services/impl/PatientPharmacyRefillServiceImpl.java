package capstone.services.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.PharmacyRefillRequest;
import capstone.services.PatientPharmacyRefillService;
import reactor.core.publisher.Mono;

@Service
public class PatientPharmacyRefillServiceImpl implements PatientPharmacyRefillService {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<UpdateResult> patientRaiseRefillRequestNotificationToPharmacy(RaiseRefillEO raiseRefillEO) {
		String requestPatientId = raiseRefillEO.getPatientId();
		ObjectId patientId = new ObjectId(requestPatientId);

		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(raiseRefillEO, Map.class);
		map.forEach((key, value) -> {
			if (value != null && !key.equals("raiseRefillId")) {
				update.set("refillMedications.$[reffMed]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("reffMed.raiseRefillId", raiseRefillEO.getRaiseRefillId()));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.flatMap(patientUpdateResult -> {
					if (patientUpdateResult.getMatchedCount() == 0) {
						return Mono.error(
								new IllegalStateException("Patient document not found or refill ID not matched."));
					}
					ObjectId pharmacyId = new ObjectId(raiseRefillEO.getPharmacyId());
					Query pharmacyQuery = new Query(Criteria.where("_id").is(pharmacyId));
					Update pharmacyUpdate = new Update().push("refillMedications", raiseRefillEO);

					return reactiveMongoTemplateRef.upsert(pharmacyQuery, pharmacyUpdate, "pharmacies")
							.flatMap(pharmacyUpdateResult -> {
								// Call the notification functions here
								raiseRefillRequestNotificationToPharmacy(raiseRefillEO);
								return updatePharmacyRequestRefillNotification(raiseRefillEO.getPharmacyId(),
										raiseRefillEO);
							});
				}).onErrorMap(e -> new RuntimeException(
						"Error during patient and pharmacy document update: " + e.getMessage(), e));
	}

	public Mono<UpdateResult> updatePharmacyRequestRefillNotification(String pharmacyId, RaiseRefillEO raiseRefill) {
		Query query = new Query(Criteria.where("pharmacyId").is(pharmacyId));

		PharmacyRefillRequest pharmacyRefillRequest = new PharmacyRefillRequest();
		pharmacyRefillRequest.setPharmacyRefillRequestId(raiseRefill.getRaiseRefillId());
		pharmacyRefillRequest.setChecked(false);
		pharmacyRefillRequest.setRefillRequest(raiseRefill);

		Update update = new Update();

		update.push("refillRequestsNotifications", pharmacyRefillRequest);

		update.inc("totalRefillRequests", 1);

		return reactiveMongoTemplateRef.upsert(query, update, "pharmacynotifications")
	            .doOnSuccess(updateResult -> {
	                System.out.println("Saved inventory notification in DB. Matched: " + updateResult.getMatchedCount() + ", Upserted: " + updateResult.getUpsertedId());
	            })
	            .doOnError(e -> System.err.println("Failed to update or create inventory refill request reminder notification for pharmacyId: "
	                    + pharmacyId + ". Error: "
	                    + e.getMessage()));
	}

	public void raiseRefillRequestNotificationToPharmacy(RaiseRefillEO request) {
		try {
			messagingTemplate.convertAndSendToUser(request.getPharmacyId(), "/Pharmacy/notifications", request);
			System.out.println("Requested Refill for this Medication Notification: Attempted to send to Pharmacy "
					+ request.getPharmacyId() + " via STOMP to /user/" + request.getPharmacyId()
					+ "/Pharmacy/notifications");
		} catch (Exception e) {
			System.err.println("Critical Error sending STOMP message for Pharmacy " + request.getPharmacyId() + ": "
					+ e.getMessage());
		}
	}
}