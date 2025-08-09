package capstone.services.impl;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.SoundPreference;
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.entities.PatientNotificationsEO;
import capstone.services.PatientServices;
import reactor.core.publisher.Mono;

@Service
public class PatientServicesImpl implements PatientServices {

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public Mono<PatientEO> getPatientById(ObjectId patientId) {
		Query query = new Query(Criteria.where("_id").is(patientId));
		return reactiveMongoTemplateRef.findOne(query, PatientEO.class)
				.doOnSuccess(patient -> System.out.println("Found patient: " + patient))
				.doOnError(error -> System.err.println("Error finding patient: " + error.getMessage()));
	}

	@Override
	public Mono<PatientEO> addNewPatient(PatientEO patientsEO) {
		return reactiveMongoTemplateRef.save(patientsEO)
				.doOnSuccess(savedPatient -> System.out.println("Patient saved successfully: " + savedPatient))
				.doOnError(error -> System.err.println("Error saving patient: " + error.getMessage()));
	}

	@Override
	public Mono<UpdateResult> updatePatientDetailsById(ObjectId patientId, PatientEO patientEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(patientEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateContactDetailsById(ObjectId patientId, Contact contactEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(contactEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set("contact." + key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateAddressDetailsById(ObjectId patientId, Address addressEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(addressEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set("address." + key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateNotificationSoundsById(ObjectId patientId, SoundPreference soundPreference) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(soundPreference, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set("soundPreference." + key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updatePrescriptionDetailsByPrescriptionId(ObjectId patientId, String prescriptionId,
			Prescription prescriptionEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(prescriptionEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("prescriptionId")) {
				update.set("prescriptions.$[pres]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("pres.prescriptionId", prescriptionId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(ObjectId patientId,
			String prescriptionId, String medicationPrescribedId, MedicationPrescribed medicationPrescribedEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(medicationPrescribedEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("medicationPrescribedId")) {
				update.set("prescriptions.$[pres].medicationsPrescribed.$[med]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("med.medicationPrescribedId", medicationPrescribedId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<MedicationTracking> getMedicationTrackingEntryByPatientPrescriptionAndMedicationId(ObjectId patientId,
			String prescriptionId, String medicationPrescribedId) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("_id").is(patientId)),
				Aggregation.unwind("prescriptions"),
				Aggregation.match(Criteria.where("prescriptions.prescriptionId").is(prescriptionId)),
				Aggregation.unwind("prescriptions.medicationTracking"), Aggregation.match(Criteria
						.where("prescriptions.medicationTracking.medicationPrescribedId").is(medicationPrescribedId)),
				Aggregation.replaceRoot("prescriptions.medicationTracking"));

		return reactiveMongoTemplateRef.aggregate(aggregation, "patients", MedicationTracking.class).next()
				.doOnSuccess(entry -> {
					if (entry != null) {
						System.out.println("Successfully found MedicationTrackingEntryEO for medication ID: "
								+ medicationPrescribedId);
					} else {
						System.out.println(
								"MedicationTrackingEntryEO not found for medication ID: " + medicationPrescribedId);
					}
				}).doOnError(e -> System.err.println("Error getting MedicationTrackingEntryEO: " + e.getMessage()));
	}

	@Override
	public Mono<MedicationPrescribed> getMedicationPrescribedByPatientPrescriptionAndMedicationId(String patientId,
			String prescriptionId, String medicationPrescribedId) {
		ObjectId id = new ObjectId(patientId);
		Aggregation aggregation = Aggregation
				.newAggregation(Aggregation.match(Criteria.where("_id").is(id)), Aggregation.unwind("prescriptions"),
						Aggregation.match(Criteria.where("prescriptions.prescriptionId").is(prescriptionId)),
						Aggregation.unwind("prescriptions.medicationsPrescribed"),
						Aggregation.match(Criteria.where("prescriptions.medicationsPrescribed.medicationPrescribedId")
								.is(medicationPrescribedId)),
						Aggregation.replaceRoot("prescriptions.medicationsPrescribed"));

		return reactiveMongoTemplateRef.aggregate(aggregation, "patients", MedicationPrescribed.class).next()
				.doOnSuccess(entry -> {
					if (entry != null) {
						System.out.println(
								"Successfully found MedicationPrescribed for medication ID: " + medicationPrescribedId);
					} else {
						System.out
								.println("MedicationPrescribed not found for medication ID: " + medicationPrescribedId);
					}
				}).doOnError(e -> System.err.println("Error getting MedicationPrescribed: " + e.getMessage()));
	}

	@Override
	public Mono<UpdateResult> updateSingleMedicationTrackingDetailTrackerDoseByPatientPrescriptionAndMedicationId(
			ObjectId patientId, String prescriptionId, String medicationPrescribedId, String date, String scheduleId,
			Dose doseStatusEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));
		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = objectMapper.convertValue(doseStatusEO, Map.class);
		map.forEach((key, value) -> {
			if (value != null && !key.equals("scheduleId")) {
				update.set(
						"prescriptions.$[pres].medicationTracking.$[med].tracker.$[track].doses.$[doseStatus]." + key,
						value);
			}
		});
		LocalDate dateForQuery = LocalDate.parse(date);
		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("med.medicationPrescribedId", medicationPrescribedId),
				Filters.eq("track.date", dateForQuery), Filters.eq("doseStatus.scheduleId", scheduleId));
		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);
		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated dose status for scheduleId: " + scheduleId
								+ " on date: " + date + " for medication: " + medicationPrescribedId);
					} else {
						System.out.println("No matching dose status found or value already the same. Patient: "
								+ patientId + ", prescription: " + prescriptionId + ", medication: "
								+ medicationPrescribedId + ", date: " + date + ", scheduleId: " + scheduleId);
					}
				}).doOnError(e -> System.err.println("Error updating dose status: " + e.getMessage()));
	}

	@Override
	public Mono<UpdateResult> addSingleMedicationTrackingDetailByPatientAndPrescriptionId(ObjectId patientId,
			String prescriptionId, MedicationTracking medicationTrackingEntry) {

		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		Document medicationTrackingEntryDoc = objectMapper.convertValue(medicationTrackingEntry, Document.class);
		update.push("prescriptions.$[pres].medicationTracking", medicationTrackingEntryDoc);

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully added new MedicationTrackingEntryEO to prescription "
								+ prescriptionId + " for patient " + patientId);
					} else {
						System.out.println("No prescription found with ID " + prescriptionId + " for patient "
								+ patientId + ". MedicationTrackingEntryEO not added.");
					}
				}).doOnError(e -> System.err.println("Error adding MedicationTrackingEntryEO: " + e.getMessage()));

	}

	@Override
	public Mono<UpdateResult> updateDoseReminderNotificationCheck(String patientId, String notificationRequestId, Boolean taken) {
		Query query = new Query(Criteria.where("patientId").is(patientId)
				.and("doseReminderNotifications.notificationRequestId").is(notificationRequestId));

		Update update = new Update().inc("totalDoseReminderNotifications", -1)
				.inc("totalDoseReminderNotificationsChecked", 1).set("doseReminderNotifications.$.checked", true)
				.set("doseReminderNotifications.$.taken", taken);

		return reactiveMongoTemplateRef.updateFirst(query, update, "patientnotifications")
				.doOnError(e -> System.err.println("Failed to update dose reminder notification for patientId: "
						+ patientId + " and notificationRequestId: " + notificationRequestId + ". Error: "
						+ e.getMessage()));
	}
	
	
	@Override
	public Mono<UpdateResult> updateRaiseRefillNotificationCheck(String patientId, String raiseRefillId){
		Query query = new Query(Criteria.where("patientId").is(patientId)
				.and("raiseRefillNotifications.raiseRefillNotificationId").is(raiseRefillId));

		Update update = new Update().inc("totalRaiseRefillNotifications", -1)
				.inc("totalRaiseRefillCheckedNotifications", 1).set("raiseRefillNotifications.$.checked", true);

		return reactiveMongoTemplateRef.updateFirst(query, update, "patientnotifications")
				.doOnError(e -> System.err.println("Failed to update raise refill reminder notification for patientId: "
						+ patientId + " and notificationRequestId: " + raiseRefillId + ". Error: "
						+ e.getMessage()));
	}
	
	@Override
	public Mono<UpdateResult> updateApproveRefillNotificationCheck(String patientId, String raiseRefillId){
		Query query = new Query(Criteria.where("patientId").is(patientId)
				.and("refillApprovedNotifications.refillApproveNotificationId").is(raiseRefillId));

		Update update = new Update().inc("totalRefillApprovedNotifications", -1)
				.inc("totalRefillApprovedCheckedNotifications", 1).set("refillApprovedNotifications.$.checked", true);

		return reactiveMongoTemplateRef.updateFirst(query, update, "patientnotifications")
				.doOnSuccess(result -> System.out.println("Matched: " + result.getMatchedCount() + ", Modified: " + result.getModifiedCount()))
				.doOnError(e -> System.err.println("Failed to update approved refill reminder notification for patientId: "
						+ patientId + " and notificationRequestId: " + raiseRefillId + ". Error: "
						+ e.getMessage()));
	}
	
	@Override
	public Mono<PatientNotificationsEO> getAllPatientNotifications(String patientId){
	 Query query = new Query(Criteria.where("patientId").is(patientId));
	 return reactiveMongoTemplateRef.findOne(query, PatientNotificationsEO.class)
			 .doOnSuccess(e -> System.out.println("Patient notifications fetched! "))
			 .doOnError(e -> System.err.println("Failed to fetch patients notification with ID: " + patientId + " : " + e.getMessage()));
	}
}
