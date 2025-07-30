package capstone.services.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed.RefillQuantity;
import capstone.entities.PatientNotificationsEO;
import capstone.entities.PharmacyEO;
import capstone.entities.PharmacyEO.PharmacyInventory;
import capstone.entities.PharmacyNotificationsEO;
import capstone.entities.RefillRequestsEO;
import capstone.entities.RefillRequestsNotificationsEO;
import capstone.services.CustomNotificationsServices;
import reactor.core.publisher.Mono;

public class CustomNotificationsServicesImpl implements CustomNotificationsServices {

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Override
	public Mono<UpdateResult> addNewRefillQuantity(ObjectId patientId, String prescriptionId,
			String medicationPrescribedId, RefillQuantity newRefillQuantityEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update().push("prescriptions.$[pres].medicationsPrescribed.$[med].refillQuantity",
				newRefillQuantityEO);

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("med.medicationPrescribedId", medicationPrescribedId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out
								.println("Successfully added refill quantity for medication: " + medicationPrescribedId
										+ " in prescription: " + prescriptionId + " for patient: " + patientId);
					} else {
						System.out.println(
								"No matching medication or prescription found to add refill quantity. Patient: "
										+ patientId + ", prescription: " + prescriptionId + ", medication: "
										+ medicationPrescribedId);
					}
				}).doOnError(e -> System.err.println("Error adding refill quantity: " + e.getMessage()));

	}

	public void sendRefillRequestNotificationToPharmacy(String pharmacyId, RefillRequestsEO refillRequestsEO) {
		try {
			messagingTemplate.convertAndSendToUser(pharmacyId, "/pharmacy/notifications", refillRequestsEO);
		} catch (Exception ex) {
			System.err.println("Error sending refill request notification to pharmacy: " + ex.getMessage());
			return;
		}
	}

	public void sendNotificationToPharmacy(String pharmacyId) {
		try {
			messagingTemplate.convertAndSendToUser(pharmacyId, "/pharmacy/notifications", "New refill request received.");
		} catch (Exception ex) {
			System.err.println("Error sending notification to pharmacy: " + ex.getMessage());
			return;
		}
	}

	public void sendNotificationToPatient(String patientId, RefillRequestsEO refillApprovedNotificationsEO) {
		try {
			messagingTemplate.convertAndSendToUser(patientId, "/patient/notifications", refillApprovedNotificationsEO);
		} catch (Exception ex) {
			System.err.println("Error sending notification to patient: " + ex.getMessage());
			return;
		}
	}

	@Override
	public Mono<Void> raiseRefillRequest(RefillRequestsEO refillRequestsEO) {
		String refillRequestNotificationId = UUID.randomUUID().toString();
		String patientId = refillRequestsEO.getPatientId();
		String pharmacyId = refillRequestsEO.getPharmacyId();
		String prescriptionId = refillRequestsEO.getPrescriptionId();
		String medicationPrescribedId = refillRequestsEO.getMedicationPrescribed().getMedicationPrescribedId();

		RefillRequestsNotificationsEO patientRefillNotification = new RefillRequestsNotificationsEO();
		patientRefillNotification.setRefillRequestNotificationId(refillRequestNotificationId);
		patientRefillNotification.setChecked(false);
		patientRefillNotification.setStatus("RAISED");
		patientRefillNotification.setRefillRequest(refillRequestsEO);

		RefillRequestsNotificationsEO pharmacyRefillNotification = new RefillRequestsNotificationsEO();
		pharmacyRefillNotification.setRefillRequestNotificationId(refillRequestNotificationId);
		pharmacyRefillNotification.setChecked(false);
		pharmacyRefillNotification.setStatus("RAISED");
		pharmacyRefillNotification.setRefillRequest(refillRequestsEO);

		RefillQuantity newRefillQuantityEO = new RefillQuantity();
		newRefillQuantityEO.setRefillId(refillRequestNotificationId);
		newRefillQuantityEO.setRequestStatus(false);
		newRefillQuantityEO.setTabletsRefilled(0);

		Mono<UpdateResult> updatePatientDocumentMono = addNewRefillQuantity(new ObjectId(patientId), prescriptionId,
				medicationPrescribedId, newRefillQuantityEO);

		Mono<UpdateResult> updatePatientNotificationsMono = reactiveMongoTemplateRef.upsert(
				Query.query(Criteria.where("patientId").is(patientId)),
				new Update().push("refillRequests", patientRefillNotification).inc("totalRefillNotifications", 1),
				PatientNotificationsEO.class);

		Mono<UpdateResult> updatePharmacyNotificationsMono = reactiveMongoTemplateRef.upsert(
				Query.query(Criteria.where("pharmacyId").is(pharmacyId)), new Update()
						.push("refillRequestsNotifications", pharmacyRefillNotification).inc("totalRefillRequests", 1),
				PharmacyNotificationsEO.class);

		return Mono.zip(updatePatientDocumentMono, updatePatientNotificationsMono, updatePharmacyNotificationsMono)
				.doOnSuccess(tuple -> {
					UpdateResult patientDocResult = tuple.getT1();
					UpdateResult patientNotifResult = tuple.getT2();
					UpdateResult pharmacyNotifResult = tuple.getT3();

					System.out.println("Refill request processed for patient: " + patientId);
					System.out.println("Patient Document Updated: " + (patientDocResult != null
							? patientDocResult.getModifiedCount() > 0 || patientDocResult.getUpsertedId() != null
							: "N/A"));
					System.out.println("Patient Notifications Updated/Created: " + (patientNotifResult != null
							? patientNotifResult.getModifiedCount() > 0 || patientNotifResult.getUpsertedId() != null
							: "N/A"));
					System.out.println("Pharmacy Notifications Updated/Created: " + (pharmacyNotifResult != null
							? pharmacyNotifResult.getModifiedCount() > 0 || pharmacyNotifResult.getUpsertedId() != null
							: "N/A"));

					sendRefillRequestNotificationToPharmacy(pharmacyId, refillRequestsEO);
				}).doOnError(error -> {
					System.err.println(
							"Failed to raise refill request for patient " + patientId + ": " + error.getMessage());
				}).then();
	}

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

	public Mono<UpdateResult> updateRefillQuantity(ObjectId patientId, String prescriptionId,
			String medicationPrescribedId, String refillId, RefillQuantity updatedRefillQuantityEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = objectMapper.convertValue(updatedRefillQuantityEO, Map.class);
		map.forEach((key, value) -> {
			if (value != null && !key.equals("refillId")) {
				update.set("prescriptions.$[pres].medicationsPrescribed.$[med].refillQuantity.$[refill]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("med.medicationPrescribedId", medicationPrescribedId),
				Filters.eq("refill.refillId", refillId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated refill quantity with ID: " + refillId
								+ " for medication: " + medicationPrescribedId);
					} else {
						System.out.println("No matching refill quantity found or value already the same. Patient: "
								+ patientId + ", prescription: " + prescriptionId + ", medication: "
								+ medicationPrescribedId + ", refillId: " + refillId);
					}
				}).doOnError(e -> System.err.println("Error updating refill quantity: " + e.getMessage()));

	}

	public Mono<UpdateResult> updatePharmacyRefillRequestNotificationStatus(String pharmacyId,
			RefillRequestsNotificationsEO refillRequestsNotificationsEO) {
		String refillRequestNotificationId = refillRequestsNotificationsEO.getRefillRequestNotificationId();

		Query query = new Query(Criteria.where("pharmacyId").is(pharmacyId)
				.and("refillRequestsNotifications.refillRequestNotificationId").is(refillRequestNotificationId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = objectMapper.convertValue(refillRequestsNotificationsEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("refillRequestNotificationId")) {

				update.set("refillRequestsNotifications.$[refReqNotId]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays
				.asList(Filters.eq("refReqNotId.refillRequestNotificationId", refillRequestNotificationId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("pharmacynotifications")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated refill request notification status for pharmacy ID: "
								+ pharmacyId + ", Notification ID: " + refillRequestNotificationId);
					} else {
						System.out.println("No matching refill request notification found for pharmacy ID: "
								+ pharmacyId + ", Notification ID: " + refillRequestNotificationId);
					}
				})
				.doOnError(e -> System.err.println("Error updating refill request notification status for pharmacy ID: "
						+ pharmacyId + ": " + e.getMessage()));
	}

	public Mono<UpdateResult> updatePatientRefillRequestNotificationStatus(String patientId,
			RefillRequestsNotificationsEO refillRequestsNotificationsEO) {
		String refillRequestNotificationId = refillRequestsNotificationsEO.getRefillRequestNotificationId();

		Query query = new Query(Criteria.where("patientId").is(patientId)
				.and("refillRequests.refillRequestNotificationId").is(refillRequestNotificationId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = objectMapper.convertValue(refillRequestsNotificationsEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("refillRequestNotificationId")) {
				update.set("refillRequests.$[refReqNotId]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays
				.asList(Filters.eq("refReqNotId.refillRequestNotificationId", refillRequestNotificationId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patientnotifications")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated refill request notification status for patient ID: "
								+ patientId + ", Notification ID: " + refillRequestNotificationId);
					} else {
						System.out.println("No matching refill request notification found for patient ID: " + patientId
								+ ", Notification ID: " + refillRequestNotificationId);
					}
				})
				.doOnError(e -> System.err.println("Error updating refill request notification status for patient ID: "
						+ patientId + ": " + e.getMessage()));
	}

	public Mono<PharmacyInventory> getPharmacyInventoryByMedicationId(ObjectId pharmacyId, String medicationId) {
		Query query = new Query(
				Criteria.where("_id").is(pharmacyId).and("pharmacyInventory.medication.medicationId").is(medicationId));

		return reactiveMongoTemplateRef.findOne(query, PharmacyEO.class).flatMap(pharmacy -> {
			if (pharmacy != null && pharmacy.getPharmacyInventory() != null) {
				return Mono.justOrEmpty(pharmacy.getPharmacyInventory().stream()
						.filter(inventory -> inventory.getMedication().getMedicationId().equals(medicationId))
						.findFirst());
			}
			return Mono.empty();
		});
	}

	public Mono<UpdateResult> updatePharmacyInventory(String pharmacyId, PharmacyInventory updatedInventory) {
		ObjectId pharmacyObjectId = new ObjectId(pharmacyId);
		String inventoryIdToUpdate = updatedInventory.getInventoryId();
		Query query = new Query(Criteria.where("_id").is(pharmacyObjectId).and("pharmacyInventory.inventoryId")
				.is(inventoryIdToUpdate));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = objectMapper.convertValue(updatedInventory, Map.class);

		map.forEach((key, value) -> {

			if (value != null && !key.equals("inventoryId")) {

				update.set("pharmacyInventory.$[elem]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("elem.inventoryId", inventoryIdToUpdate));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("pharacies")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated pharmacy inventory for Pharmacy ID: " + pharmacyId
								+ ", Inventory ID: " + inventoryIdToUpdate);
					} else {
						System.out.println("No matching pharmacy inventory found for Pharmacy ID: " + pharmacyId
								+ ", Inventory ID: " + inventoryIdToUpdate + ". No update performed.");
					}
				}).doOnError(e -> System.err.println("Error updating pharmacy inventory for Pharmacy ID: " + pharmacyId
						+ ", Inventory ID: " + inventoryIdToUpdate + ": " + e.getMessage()));
	}
	
//	public Mono<UpdateResult> raiseInventoryRefillRequest(String pharmacyId) {
//		
//	}

	public Mono<Void> approveRefillRequest(RefillRequestsNotificationsEO refillRequestNotificationEO,
			Integer refilledQuantity) {
		ObjectId pharmacyId = new ObjectId(refillRequestNotificationEO.getRefillRequest().getPharmacyId());
		String medicationPrescribedId = refillRequestNotificationEO.getRefillRequest().getMedicationPrescribed()
				.getMedicationPrescribedId();
		String prescriptionId = refillRequestNotificationEO.getRefillRequest().getPrescriptionId();
		ObjectId patientId = new ObjectId(refillRequestNotificationEO.getRefillRequest().getPatientId());
		String refillId = refillRequestNotificationEO.getRefillRequestNotificationId();

		return getPharmacyInventoryByMedicationId(pharmacyId, medicationPrescribedId)
				.switchIfEmpty(Mono.error(new IllegalArgumentException(
						"No inventory found for medication ID: " + medicationPrescribedId)))
				.flatMap(pharmacyInventory -> {
					if (pharmacyInventory.getCurrentStockTablets() < refilledQuantity) {
						System.out.println("Insufficient stock to approve refill request. Current stock: "
								+ pharmacyInventory.getCurrentStockTablets() + ", Requested refill quantity: "
								+ refilledQuantity);
						return Mono.error(new IllegalArgumentException("Insufficient stock to approve refill request"));
					}

					pharmacyInventory
							.setCurrentStockTablets(pharmacyInventory.getCurrentStockTablets() - refilledQuantity);
					return reactiveMongoTemplateRef.save(pharmacyInventory);
				}).flatMap(savedInventory -> {
					if (savedInventory.getCurrentStockTablets() < savedInventory.getReorderThresholdTablets()) {
						sendRefillRequestNotificationToPharmacy(refillRequestNotificationEO.getRefillRequest().getPharmacyId(),
								refillRequestNotificationEO.getRefillRequest());
					}

					RefillRequestsNotificationsEO updatePharmacyRefillRequestNotificationEO = new RefillRequestsNotificationsEO();
					updatePharmacyRefillRequestNotificationEO.setStatus("APPROVED");
					updatePharmacyRefillRequestNotificationEO.setChecked(true);
					updatePharmacyRefillRequestNotificationEO.setRefilledQuantity(refilledQuantity);

					RefillRequestsNotificationsEO updatePatientRefillRequestNotificationEO = new RefillRequestsNotificationsEO();
					updatePatientRefillRequestNotificationEO.setStatus("APPROVED");
					updatePatientRefillRequestNotificationEO.setRefilledQuantity(refilledQuantity);

					return updatePharmacyRefillRequestNotificationStatus(
							refillRequestNotificationEO.getRefillRequest().getPharmacyId(),
							updatePharmacyRefillRequestNotificationEO).flatMap(updateResult -> {
								if (updateResult.getModifiedCount() > 0) {
									System.out.println(
											"Successfully updated pharmacy refill request notification status.");
									return Mono.just(updateResult);
								} else {
									System.out.println("No matching pharmacy refill request notification found.");
									return Mono.error(new IllegalArgumentException(
											"No matching pharmacy refill request notification found"));
								}
							})
							.then(updatePatientRefillRequestNotificationStatus(
									refillRequestNotificationEO.getRefillRequest().getPatientId(),
									updatePatientRefillRequestNotificationEO))
							.flatMap(updateResult -> {
								if (updateResult.getModifiedCount() > 0) {
									System.out.println(
											"Successfully updated patient refill request notification status.");
									return Mono.empty();
								} else {
									System.out.println("No matching patient refill request notification found.");
									return Mono.error(new IllegalArgumentException(
											"No matching patient refill request notification found"));
								}
							}).then(Mono.defer(() -> {
								MedicationPrescribed updatedMedPrescribed = new MedicationPrescribed();
								updatedMedPrescribed.setCurrentTabletsInHand(refilledQuantity);
								return updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(patientId,
										prescriptionId, medicationPrescribedId, updatedMedPrescribed);
							})).then(Mono.defer(() -> {
								RefillQuantity refillQuantity = new RefillQuantity();
								refillQuantity.setRequestStatus(true);
								refillQuantity.setTabletsRefilled(refilledQuantity);
								return updateRefillQuantity(patientId, prescriptionId, medicationPrescribedId, refillId,
										refillQuantity).then();
							}));
				});
	}

}
