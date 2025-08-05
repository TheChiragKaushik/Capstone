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
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.PatientEO;
import capstone.entities.RaiseRefillNotifications;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.services.PatientRefillNotifications;
import reactor.core.publisher.Mono;

@Service
public class PatientRefillNotificationsImpl implements PatientRefillNotifications {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<UpdateResult> updateMedicationDoseAndRecalculateTotals(String inputPatientId, String prescriptionId,
			String medicationPrescribedId, String date, String scheduleId, Dose doseStatusUpdate) {
		ObjectId patientId = new ObjectId(inputPatientId);

		Query doseUpdateQuery = new Query(Criteria.where("_id").is(patientId));
		Update doseFieldUpdate = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> doseUpdatesMap = new ObjectMapper().convertValue(doseStatusUpdate, Map.class);
		doseUpdatesMap.forEach((key, value) -> {
			if (value != null && !key.equals("scheduleId")) {
				doseFieldUpdate.set(
						"prescriptions.$[pres].medicationTracking.$[track].tracker.$[dateEntry].doses.$[doseEntry]."
								+ key,
						value);
			}
		});

		List<Bson> doseArrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId),
				Filters.eq("track.medicationPrescribedId", medicationPrescribedId), Filters.eq("dateEntry.date", date),
				Filters.eq("doseEntry.scheduleId", scheduleId));
		UpdateOptions doseUpdateOptions = new UpdateOptions().arrayFilters(doseArrayFilters);

		return reactiveMongoTemplateRef.getCollection("patients").flatMap(collection -> Mono.from(collection
				.updateOne(doseUpdateQuery.getQueryObject(), doseFieldUpdate.getUpdateObject(), doseUpdateOptions)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated dose for scheduleId: " + scheduleId + " on date: "
								+ date + " for medication: " + medicationPrescribedId);
					} else {
						System.out.println("No matching dose found or value already the same for dose update. Patient: "
								+ patientId + ", prescription: " + prescriptionId + ", medication: "
								+ medicationPrescribedId + ", date: " + date + ", scheduleId: " + scheduleId);
					}
				}).doOnError(e -> System.err.println("Error updating dose: " + e.getMessage()))
				.flatMap(updateResult -> {
					if (doseStatusUpdate.getTaken() == null || !doseStatusUpdate.getTaken()) {
						System.out.println("Dose was not taken, skipping recalculation and notification logic.");
						return Mono.just(updateResult);
					}

					return reactiveMongoTemplateRef.findOne(new Query(
							Criteria.where("_id").is(patientId).and("prescriptions.prescriptionId").is(prescriptionId)),
							PatientEO.class).flatMap(patient -> {
								if (patient == null) {
									return Mono.error(
											new RuntimeException("Patient not found after dose update: " + patientId));
								}

								Prescription targetPrescription = patient.getPrescriptions().stream()
										.filter(p -> p.getPrescriptionId().equals(prescriptionId)).findFirst()
										.orElse(null);

								if (targetPrescription == null) {
									return Mono
											.error(new RuntimeException("Prescription not found: " + prescriptionId));
								}

								MedicationPrescribed targetMedication = targetPrescription.getMedicationsPrescribed()
										.stream()
										.filter(mp -> mp.getMedicationPrescribedId().equals(medicationPrescribedId))
										.findFirst().orElse(null);

								if (targetMedication == null) {
									return Mono.error(new RuntimeException(
											"MedicationPrescribed not found: " + medicationPrescribedId));
								}

								Integer totalToTake = 0;
								Integer totalTook = 0;
								Integer currentInHand = 0;
								String medicationType = "";
								
								String soundUrl = null;
								if (patient.getSoundPreference() != null) {
								    soundUrl = patient.getSoundPreference().getRefillReminderNotificationSound();
								}

								boolean isTablets = doseStatusUpdate.getTabletsTaken() != null;
								boolean isVolume = doseStatusUpdate.getVolumeTaken() != null;

								if (isTablets) {
									medicationType = "tablets";
									totalToTake = targetMedication.getTotalTabletToTake();
									Integer existingTotalTook = targetMedication.getTotalTabletsTook() != null
											? targetMedication.getTotalTabletsTook()
											: 0;
									totalTook = existingTotalTook + doseStatusUpdate.getTabletsTaken();
									currentInHand = targetMedication.getCurrentTabletsInHand()
											- doseStatusUpdate.getTabletsTaken();
								} else if (isVolume) {
									medicationType = "volume";
									totalToTake = targetMedication.getTotalVolumeToTake();
									Integer existingTotalTook = targetMedication.getTotalVolumeTook() != null
											? targetMedication.getTotalVolumeTook()
											: 0;
									totalTook = existingTotalTook + doseStatusUpdate.getVolumeTaken();
									currentInHand = targetMedication.getCurrentVolumeInhand()
											- doseStatusUpdate.getVolumeTaken();
								} else {
									medicationType = "tablets";
									totalToTake = targetMedication.getTotalTabletToTake();
									Integer existingTotalTook = targetMedication.getTotalTabletsTook() != null
											? targetMedication.getTotalTabletsTook()
											: 0;
									totalTook = existingTotalTook + doseStatusUpdate.getTabletsTaken();
									currentInHand = targetMedication.getCurrentTabletsInHand()
											- doseStatusUpdate.getTabletsTaken();
								}

								Integer requiredMedicationNumber = 0;
								Boolean calculatedRefillRequired = false;
								if (targetMedication.getRefillAlertThreshold() != null
										&& targetMedication.getRefillsAllowed() != null
										&& targetMedication.getRefillsAllowed()) {
									if (currentInHand < targetMedication.getRefillAlertThreshold()) {
										calculatedRefillRequired = true;
										requiredMedicationNumber = totalToTake - (totalTook + currentInHand);
									}
								}

								Query medicationUpdateQuery = new Query(Criteria.where("_id").is(patientId));
								Update medicationFieldUpdate = new Update();

								if ("tablets".equals(medicationType)) {
									medicationFieldUpdate.set(
											"prescriptions.$[pres].medicationsPrescribed.$[med].totalTabletsTook",
											totalTook);
									medicationFieldUpdate.set(
											"prescriptions.$[pres].medicationsPrescribed.$[med].currentTabletsInHand",
											currentInHand);
								} else if ("volume".equals(medicationType)) {
									medicationFieldUpdate.set(
											"prescriptions.$[pres].medicationsPrescribed.$[med].totalVolumeTook",
											totalTook);
									medicationFieldUpdate.set(
											"prescriptions.$[pres].medicationsPrescribed.$[med].currentVolumeInhand",
											currentInHand);
								}

								medicationFieldUpdate.set(
										"prescriptions.$[pres].medicationsPrescribed.$[med].refillRequired",
										calculatedRefillRequired);

								List<Bson> medicationArrayFilters = Arrays.asList(
										Filters.eq("pres.prescriptionId", prescriptionId),
										Filters.eq("med.medicationPrescribedId", medicationPrescribedId));
								UpdateOptions medicationUpdateOptions = new UpdateOptions()
										.arrayFilters(medicationArrayFilters);

								Mono<UpdateResult> finalUpdateMono = reactiveMongoTemplateRef.getCollection("patients")
										.flatMap(collection -> Mono.from(collection.updateOne(
												medicationUpdateQuery.getQueryObject(),
												medicationFieldUpdate.getUpdateObject(), medicationUpdateOptions)))
										.doOnSuccess(finalUpdateResult -> {
											if (finalUpdateResult.getModifiedCount() > 0) {
												System.out.println(
														"Successfully updated medication prescribed totals for medication: "
																+ medicationPrescribedId);
											} else {
												System.out.println(
														"No matching medication prescribed found or values already the same for total updates. Medication: "
																+ medicationPrescribedId);
											}
										}).doOnError(e -> System.err.println(
												"Error updating medication prescribed totals: " + e.getMessage()));

								if (calculatedRefillRequired) {

									RaiseRefillEO newRefillRequest = new RaiseRefillEO();

									newRefillRequest.setRaiseRefillId(UUID.randomUUID().toString());
									newRefillRequest.setPatientId(patientId.toString());
									newRefillRequest.setProviderId(targetPrescription.getProviderId());
									newRefillRequest.setPrescriptionForDescription(targetPrescription.getPrescriptionForDescription());
									newRefillRequest.setMedicationPrescribed(targetMedication);
									newRefillRequest.setMedicationId(targetMedication.getMedicationId());
									newRefillRequest.setMedicationName(targetMedication.getMedication().getName());
									newRefillRequest.setPrescriptionId(prescriptionId);
									newRefillRequest.setMedicationPrescribedId(medicationPrescribedId);
									if (targetMedication.getTotalTabletToTake() != null) {
										newRefillRequest.setDoseTabletsRequired(requiredMedicationNumber);
									} else {
										newRefillRequest.setDoseVolumeRequired(requiredMedicationNumber);
									}
									newRefillRequest.setMessage("This medication: "
											+ targetMedication.getMedication().getName() + " with Prescription ID: "
											+ prescriptionId + " and MedicationPrescribed ID: " + medicationPrescribedId
											+ " needs refill ASAP!");
									newRefillRequest.setStatus("Wanted");
									newRefillRequest.setSoundUrl(soundUrl);

									return updatePatientRaiseRefillNotification(patientId.toString(), newRefillRequest)
											.then(updateRefillMedicationsInPatient(patientId, newRefillRequest))
											.then(Mono.fromRunnable(
													() -> sendRaiseRefillNotificationToPatient(newRefillRequest)))
											.then(finalUpdateMono);
								} else {
									return finalUpdateMono;
								}
							}).switchIfEmpty(Mono.error(
									new RuntimeException("Patient or Prescription not found for update operation.")));
				});
	}

	@Override
	public Mono<UpdateResult> updateRefillMedicationsInPatient(ObjectId patientId, RaiseRefillEO raiseRefillEO) {
		Query query = new Query(Criteria.where("_id").is(patientId));
		Update update = new Update();

		update.push("refillMedications", raiseRefillEO);

		return reactiveMongoTemplateRef.upsert(query, update, "patients");
	}

	public Mono<UpdateResult> updatePatientRaiseRefillNotification(String patientId, RaiseRefillEO raiseRefill) {

		Query query = new Query(Criteria.where("patientId").is(patientId));

		RaiseRefillNotifications raiseRefillNotifications = new RaiseRefillNotifications();
		raiseRefillNotifications.setRaiseRefillNotificationId(raiseRefill.getRaiseRefillId());
		raiseRefillNotifications.setChecked(false);
		raiseRefillNotifications.setRaiseRefill(raiseRefill);

		Update update = new Update();

		update.push("raiseRefillNotifications", raiseRefillNotifications);

		update.inc("totalRaiseRefillNotifications", 1);

		return reactiveMongoTemplateRef.upsert(query, update, "patientnotifications");
	}

	public void sendRaiseRefillNotificationToPatient(RaiseRefillEO request) {
		try {
			messagingTemplate.convertAndSendToUser(request.getPatientId(), "/Patient/notifications", request);
			System.out.println("Scheduled Get Refill for this Medication Notification: Attempted to send to "
					+ request.getPatientId() + " via STOMP to /user/" + request.getPatientId()
					+ "/Patient/notifications");
		} catch (Exception e) {
			System.err.println("Critical Error sending STOMP message for patient " + request.getPatientId() + ": "
					+ e.getMessage());
		}
	}
	
	
}