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
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
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

	public Mono<MedicationPrescribed> getMedicationPrescribedByPatientPrescriptionAndMedicationId(ObjectId patientId,
			String prescriptionId, String medicationPrescribedId) {
		Aggregation aggregation = Aggregation
				.newAggregation(Aggregation.match(Criteria.where("_id").is(patientId)),
						Aggregation.unwind("prescriptions"),
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
				update.set("prescriptions.$[pres].medicationTracking.$[med].tracker.$[track].doses.$[doseStatus]." + key, value);
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
	public Mono<UpdateResult> updateMedicationDoseAndRecalculateTotals(
            ObjectId patientId,
            String prescriptionId,
            String medicationPrescribedId,
            String date,
            String scheduleId,
            Dose doseStatusUpdate) {

        
        Query doseUpdateQuery = new Query(Criteria.where("_id").is(patientId));
        Update doseFieldUpdate = new Update();

       
        @SuppressWarnings("unchecked")
        Map<String, Object> doseUpdatesMap = objectMapper.convertValue(doseStatusUpdate, Map.class);
        doseUpdatesMap.forEach((key, value) -> {
            if (value != null && !key.equals("scheduleId")) {
                doseFieldUpdate.set("prescriptions.$[pres].medicationsPrescribed.$[med].medicationTracking.$[track].tracker.$[dateEntry].doses.$[doseEntry]." + key, value);
            }
        });

        
        List<Bson> doseArrayFilters = Arrays.asList(
                Filters.eq("pres.prescriptionId", prescriptionId),
                Filters.eq("med.medicationPrescribedId", medicationPrescribedId),
                Filters.eq("dateEntry.date", date),
                Filters.eq("doseEntry.scheduleId", scheduleId)
        );
        UpdateOptions doseUpdateOptions = new UpdateOptions().arrayFilters(doseArrayFilters);

        
        return reactiveMongoTemplateRef.getCollection("patients")
                .flatMap(collection -> Mono.from(collection.updateOne(doseUpdateQuery.getQueryObject(), doseFieldUpdate.getUpdateObject(), doseUpdateOptions)))
                .doOnSuccess(updateResult -> {
                    if (updateResult.getModifiedCount() > 0) {
                        System.out.println("Successfully updated dose for scheduleId: " + scheduleId
                                + " on date: " + date + " for medication: " + medicationPrescribedId);
                    } else {
                        System.out.println("No matching dose found or value already the same for dose update. Patient: "
                                + patientId + ", prescription: " + prescriptionId + ", medication: "
                                + medicationPrescribedId + ", date: " + date + ", scheduleId: " + scheduleId);
                    }
                })
                .doOnError(e -> System.err.println("Error updating dose: " + e.getMessage()))
                .then(
                    
                    reactiveMongoTemplateRef.findOne(
                        new Query(Criteria.where("_id").is(patientId)
                            .and("prescriptions.prescriptionId").is(prescriptionId)),
                        PatientEO.class
                    )
                )
                .flatMap(patient -> {
                    if (patient == null) {
                        return Mono.error(new RuntimeException("Patient not found after dose update: " + patientId));
                    }

                    
                    Prescription targetPrescription = patient.getPrescriptions().stream()
                            .filter(p -> p.getPrescriptionId().equals(prescriptionId))
                            .findFirst()
                            .orElse(null);

                    if (targetPrescription == null) {
                        return Mono.error(new RuntimeException("Prescription not found: " + prescriptionId));
                    }

                    MedicationPrescribed targetMedication = targetPrescription.getMedicationsPrescribed().stream()
                            .filter(mp -> mp.getMedicationPrescribedId().equals(medicationPrescribedId))
                            .findFirst()
                            .orElse(null);

                    if (targetMedication == null) {
                        return Mono.error(new RuntimeException("MedicationPrescribed not found: " + medicationPrescribedId));
                    }

                    
                    int calculatedTotalTabletsTook = targetPrescription.getMedicationTracking().stream()
                            .filter(mt -> mt.getMedicationPrescribedId().equals(medicationPrescribedId))
                            .flatMap(mt -> mt.getTracker().stream())
                            .flatMap(tracker -> tracker.getDoses().stream())
                            .filter(Dose::getTaken) // Only count doses marked as taken
                            .mapToInt(Dose::getTabletsTaken)
                            .sum();

                   
                    int totalTabletsInPrescription = targetMedication.getTotalTabletToTake() != null ?
                                                     targetMedication.getTotalTabletToTake() : 0;
                    
                    int calculatedCurrentTabletsInHand = totalTabletsInPrescription - calculatedTotalTabletsTook;

                   
                    boolean calculatedRefillRequired = false;
                    if (targetMedication.getRefillAlertThreshold() != null && targetMedication.getRefillsAllowed() != null && targetMedication.getRefillsAllowed()) {
                        if (calculatedCurrentTabletsInHand <= targetMedication.getRefillAlertThreshold()) {
                            calculatedRefillRequired = true;
                        }
                    }

                    
                    Query medicationUpdateQuery = new Query(Criteria.where("_id").is(patientId));
                    Update medicationFieldUpdate = new Update();

                    medicationFieldUpdate.set("prescriptions.$[pres].medicationsPrescribed.$[med].totalTabletsTook", calculatedTotalTabletsTook);
                    medicationFieldUpdate.set("prescriptions.$[pres].medicationsPrescribed.$[med].currentTabletsInHand", calculatedCurrentTabletsInHand);
                    medicationFieldUpdate.set("prescriptions.$[pres].medicationsPrescribed.$[med].refillRequired", calculatedRefillRequired);

                    List<Bson> medicationArrayFilters = Arrays.asList(
                            Filters.eq("pres.prescriptionId", prescriptionId),
                            Filters.eq("med.medicationPrescribedId", medicationPrescribedId)
                    );
                    UpdateOptions medicationUpdateOptions = new UpdateOptions().arrayFilters(medicationArrayFilters);

                    
                    return reactiveMongoTemplateRef.getCollection("patients")
                            .flatMap(collection -> Mono.from(collection.updateOne(medicationUpdateQuery.getQueryObject(), medicationFieldUpdate.getUpdateObject(), medicationUpdateOptions)))
                            .doOnSuccess(finalUpdateResult -> {
                                if (finalUpdateResult.getModifiedCount() > 0) {
                                    System.out.println("Successfully updated medication prescribed totals for medication: " + medicationPrescribedId);
                                } else {
                                    System.out.println("No matching medication prescribed found or values already the same for total updates. Medication: " + medicationPrescribedId);
                                }
                            })
                            .doOnError(e -> System.err.println("Error updating medication prescribed totals: " + e.getMessage()));
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Patient or Prescription not found for update operation.")));
    }

}
