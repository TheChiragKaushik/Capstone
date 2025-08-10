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

import capstone.entities.RefillApprovedNotifications;
import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.InventoryRestockReminderNotificationsEO;
import capstone.entities.PharmacyEO;
import capstone.services.PharmacyPatientRequestRefillService;
import reactor.core.publisher.Mono;


@Service
public class PharmacyPatientRequestRefillServiceImpl implements PharmacyPatientRequestRefillService {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<UpdateResult> approveRefillRequest(RaiseRefillEO raiseRefillEO) {
	    return checkPharmacyInventoryForEnoughMedication(raiseRefillEO)
	            .doOnError(throwable -> System.err.println("Error updating pharmacy inventory: " + throwable.getMessage()))
	            .flatMap(updateResult -> {
	                if (updateResult.getModifiedCount() > 0) {
	                    return updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(raiseRefillEO)
	                            .doOnError(throwable -> System.err.println("Error updating medication prescribed details: " + throwable.getMessage()))
	                            .flatMap(result -> updateRaisedRefillStatus(raiseRefillEO, "patients"))
	                            .doOnError(throwable -> System.err.println("Error updating raised refill status for patients: " + throwable.getMessage()))
	                            .flatMap(result -> updateRaisedRefillStatus(raiseRefillEO, "pharmacies"))
	                            .doOnError(throwable -> System.err.println("Error updating raised refill status for pharmacies: " + throwable.getMessage()))
	                            .flatMap(result -> updatePatientNotification(raiseRefillEO))
	                            .doOnError(throwable -> System.err.println("Error updating patient notification: " + throwable.getMessage()))
	                            .doOnSuccess(result -> sendRefillApproveNotificationToPatient(raiseRefillEO));
	                } else {
	                    System.out.println("Inventory not updated. Not enough stock for medication " + raiseRefillEO.getMedicationId());
	                    return Mono.error(new IllegalStateException("Not enough stock in pharmacy inventory."));
	                }
	            })
	            .doOnSuccess(updateResult -> checkAndSendInventoryNotification(raiseRefillEO));
	}
	
//	@Override
//	public Mono<UpdateResult> approveRefillRequest(RaiseRefillEO raiseRefillEO) {
//		return updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(raiseRefillEO)
//				.doOnError(throwable -> System.err.println("Error updating medication prescribed details: " + throwable.getMessage()))
//				.flatMap(updateResult -> updateRaisedRefillStatus(raiseRefillEO, "patients"))
//				.doOnError(throwable -> System.err.println("Error updating raised refill status for patients: " + throwable.getMessage()))
//				.flatMap(updateResult -> updateRaisedRefillStatus(raiseRefillEO, "pharmacies"))
//				.doOnError(throwable -> System.err.println("Error updating raised refill status for pharmacies: " + throwable.getMessage()))
//				.flatMap(updateResult -> updatePatientNotification(raiseRefillEO))
//				.doOnError(throwable -> System.err.println("Error updating patient notification: " + throwable.getMessage()))
//				.doOnSuccess(updateResult -> sendRefillApproveNotificationToPatient(raiseRefillEO))
//				.flatMap(updateResult -> updatePharmacyInventory(raiseRefillEO))
//		        .doOnError(throwable -> System.err.println("Error updating pharmacy inventory: " + throwable.getMessage()));
//	}
	
	public Mono<UpdateResult> checkPharmacyInventoryForEnoughMedication(RaiseRefillEO raiseRefillEO) {
	    Integer doseRequired = raiseRefillEO.getDoseTabletsRequired() != null ? raiseRefillEO.getDoseTabletsRequired() : raiseRefillEO.getDoseVolumeRequired();
	    String pharmacyId = raiseRefillEO.getPharmacyId();
	    String medicationId = raiseRefillEO.getMedicationId();

	    Query finalQuery;
	    Update finalUpdate = new Update();

	    if (raiseRefillEO.getDoseTabletsRequired() != null) {
	        finalQuery = new Query(Criteria.where("_id").is(pharmacyId)
	                .and("pharmacyInventory").elemMatch(
	                    Criteria.where("medicationId").is(medicationId)
	                            .and("currentStockTablets").gte(doseRequired)
	                ));
	        finalUpdate.inc("pharmacyInventory.$.currentStockTablets", -doseRequired);
	    } else {
	        finalQuery = new Query(Criteria.where("_id").is(pharmacyId)
	                .and("pharmacyInventory").elemMatch(
	                    Criteria.where("medicationId").is(medicationId)
	                            .and("currentStockVolume").gte(doseRequired)
	                ));
	        finalUpdate.inc("pharmacyInventory.$.currentStockVolume", -doseRequired);
	    }

	    return reactiveMongoTemplateRef.updateFirst(finalQuery, finalUpdate, PharmacyEO.class);
	}
	public Mono<UpdateResult> updatePatientNotification(RaiseRefillEO raiseRefillEO){
		String patientId = raiseRefillEO.getPatientId();
		Query query = new Query(Criteria.where("patientId").is(patientId));

		RefillApprovedNotifications refillApprovedNotifications = new RefillApprovedNotifications();
		refillApprovedNotifications.setRefillApproveNotificationId(raiseRefillEO.getRaiseRefillId());
		refillApprovedNotifications.setChecked(false);
		refillApprovedNotifications.setApprovedRefill(raiseRefillEO);

		Update update = new Update();

		update.push("refillApprovedNotifications", refillApprovedNotifications);

		update.inc("totalRefillApprovedNotifications", 1);
		
		update.pull("raiseRefillNotifications", new Query(Criteria.where("raiseRefillNotificationId").is(raiseRefillEO.getRaiseRefillId())));
        update.inc("totalRaiseRefillCheckedNotifications", -1);

		return reactiveMongoTemplateRef.upsert(query, update, "patientnotifications");
	}

	public Mono<UpdateResult> updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(
			RaiseRefillEO raiseRefill) {

		ObjectId patientId = new ObjectId(raiseRefill.getPatientId());
		String prescriptionId = raiseRefill.getPrescriptionId();
		String medicationPrescribedId = raiseRefill.getMedicationPrescribedId();

		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();
		if (raiseRefill.getRefillQuantityTablets() != null) {
			update.inc("prescriptions.$[pres].medicationsPrescribed.$[med].currentTabletsInHand",
					raiseRefill.getRefillQuantityTablets());
		} else {
			update.inc("prescriptions.$[pres].medicationsPrescribed.$[med].currentVolumeInhand",
					raiseRefill.getRefillQuantityVolume());
		}

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("med.medicationPrescribedId", medicationPrescribedId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	public Mono<UpdateResult> updateRaisedRefillStatus(RaiseRefillEO raiseRefill, String collectionName) {
		ObjectId documentId = collectionName.equals("patients") ? new ObjectId(raiseRefill.getPatientId())
				: new ObjectId(raiseRefill.getPharmacyId());

		String raiseRefillId = raiseRefill.getRaiseRefillId();

		Query query = new Query(Criteria.where("_id").is(documentId));
		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(raiseRefill, Map.class);
		map.forEach((key, value) -> {
			if (value != null && !key.equals("prescriptionId")) {
				update.set("refillMedications.$[reffMed]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("reffMed.raiseRefillId", raiseRefillId));
		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection(collectionName).flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	public void sendRefillApproveNotificationToPatient(RaiseRefillEO request) {
		try {
			messagingTemplate.convertAndSendToUser(request.getPatientId(), "/Patient/notifications", request);
			System.out.println("Scheduled Approved Refill for this Medication Notification: Attempted to send to "
					+ request.getPatientId() + " via STOMP to /user/" + request.getPatientId()
					+ "/Patient/notifications");
		} catch (Exception e) {
			System.err.println("Critical Error sending STOMP message for patient " + request.getPatientId() + ": "
					+ e.getMessage());
		}
	}
	
	public Mono<UpdateResult> updatePharmacyInventory(RaiseRefillEO raiseRefillEO) {
		ObjectId pharmacyId = new ObjectId(raiseRefillEO.getPharmacyId());
		String medicationId = raiseRefillEO.getMedicationId();

		Query query = new Query(Criteria.where("_id").is(pharmacyId)
				.and("pharmacyInventory.medicationId").is(medicationId));

		Update update = new Update();

		if (raiseRefillEO.getRefillQuantityTablets() != null) {
			update.inc("pharmacyInventory.$.currentStockTablets", -raiseRefillEO.getRefillQuantityTablets());
		} else {
			update.inc("pharmacyInventory.$.currentStockVolume", -raiseRefillEO.getRefillQuantityVolume());
		}
		
		return reactiveMongoTemplateRef.getCollection("pharmacies")
				.flatMap(collection -> Mono.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject())))
				.doOnSuccess(updateResult -> checkAndSendInventoryNotification(raiseRefillEO));
	}

	private void checkAndSendInventoryNotification(RaiseRefillEO raiseRefillEO) {
    ObjectId pharmacyId = new ObjectId(raiseRefillEO.getPharmacyId());
    String medicationId = raiseRefillEO.getMedicationId();

    Query query = new Query(Criteria.where("_id").is(pharmacyId)
            .and("pharmacyInventory.medicationId").is(medicationId));
    
    reactiveMongoTemplateRef.findOne(query, PharmacyEO.class, "pharmacies")
            .subscribe(pharmacy -> {
                if (pharmacy != null && pharmacy.getPharmacyInventory() != null) {
                    pharmacy.getPharmacyInventory().stream()
                            .filter(inventory -> inventory.getMedicationId().equals(medicationId))
                            .findFirst()
                            .ifPresent(inventory -> {
                                boolean sendNotification = false;
                                String message = "";
                                if (inventory.getCurrentStockTablets() != null && inventory.getReorderThresholdTablets() != null &&
                                        inventory.getCurrentStockTablets() < inventory.getReorderThresholdTablets()) {
                                    sendNotification = true;
                                    message = "Inventory for " + raiseRefillEO.getMedicationName() + " is low. Current stock is " + 
                                            inventory.getCurrentStockTablets() + " tablets, which is below the reorder threshold of " + 
                                            inventory.getReorderThresholdTablets() + " tablets.";
                                } else if (inventory.getCurrentStockVolume() != null && inventory.getReorderThresholdVolume() != null &&
                                        inventory.getCurrentStockVolume() < inventory.getReorderThresholdVolume()) {
                                    sendNotification = true;
                                    message = "Inventory for " + raiseRefillEO.getMedicationName() + " is low. Current stock is " + 
                                            inventory.getCurrentStockVolume() + " volume, which is below the reorder threshold of " + 
                                            inventory.getReorderThresholdVolume() + " volume.";
                                }
                                
                                if(sendNotification) {
                                    InventoryRestockReminderNotificationsEO notification = new InventoryRestockReminderNotificationsEO();
                                    notification.setChecked(false);
                                    notification.setMedicationName(raiseRefillEO.getMedicationName());
                                    notification.setMedicationId(medicationId);
                                    notification.setInventoryId(inventory.getInventoryId());
                                    notification.setMessage(message);
                                    
                                    updatePharmacyInventoryNotification(raiseRefillEO.getPharmacyId(), notification)
                                        .doOnSuccess(updateResult -> {
                                            System.out.println("inventoryRestockReminderNotifications saved!");
                                            // Only send the STOMP message after the DB save is confirmed
                                            sendInventoryUpdateNotificationToPharmacy(raiseRefillEO.getPharmacyId(), notification);
                                        })
                                        .subscribe(); 
                                }
                            });
                }
            });
}
	
	
	public Mono<UpdateResult> updatePharmacyInventoryNotification(String pharmacyId, InventoryRestockReminderNotificationsEO notification){
		
		Query query = new Query(Criteria.where("pharmacyId").is(pharmacyId));

		Update update = new Update();

		update.push("inventoryRestockReminderNotifications", notification);

		update.inc("totalPharmacyInventoryRestockReminderNotifications", 1);

		return reactiveMongoTemplateRef.upsert(query, update, "pharmacynotifications")
	            .doOnSuccess(updateResult -> {
	                System.out.println("Saved inventory notification in DB. Matched: " + updateResult.getMatchedCount() + ", Upserted: " + updateResult.getUpsertedId());
	            })
	            .doOnError(e -> System.err.println("Failed to update or create inventory refill request reminder notification for pharmacyId: "
	                    + pharmacyId + ". Error: "
	                    + e.getMessage()));
	}

	public void sendInventoryUpdateNotificationToPharmacy(String pharmacyId, InventoryRestockReminderNotificationsEO request) {
		try {
			messagingTemplate.convertAndSendToUser(pharmacyId, "/Pharmacy/notifications", request);
			System.out.println("Scheduled Inventory update for this Medication Notification: Attempted to send to "
					+ pharmacyId + " via STOMP to /user/" + pharmacyId
					+ "/Pharmacy/notifications");
		} catch (Exception e) {
			System.err.println("Critical Error sending STOMP message for pharmacy " + pharmacyId + ": "
					+ e.getMessage());
		}
	}

}
