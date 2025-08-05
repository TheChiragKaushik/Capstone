package capstone.services.impl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
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
import capstone.entities.Constants.PatientRef;
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed.Schedule;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.entities.PatientNotificationsRequestsEO;
import capstone.entities.ProviderEO;
import capstone.services.ProviderServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ProviderServicesImpl implements ProviderServices {

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<ProviderEO> addNewProvider(ProviderEO provider) {
		return reactiveMongoTemplateRef.save(provider)
				.doOnSuccess(savedProvider -> System.out.println("Provider saved: " + savedProvider))
				.doOnError(error -> System.err.println("Error saving provider: " + error.getMessage()));
	}

	@Override
	public Mono<ProviderEO> getProviderById(ObjectId providerId) {
		return reactiveMongoTemplateRef.findById(providerId, ProviderEO.class)
				.doOnSuccess(provider -> System.out.println("Provider retrieved: " + provider))
				.doOnError(error -> System.err.println("Error retrieving provider: " + error.getMessage()));
	}

	@Override
	public Mono<UpdateResult> updateProviderById(ObjectId providerId, ProviderEO providerEO) {
		Query query = new Query(Criteria.where("_id").is(providerId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(providerEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("providers").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateProviderContact(ObjectId providerId, Contact contact) {
		Query query = new Query(Criteria.where("_id").is(providerId));

		Update update = new Update();
		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(contact, Map.class);
		map.forEach((key, value) -> {

			if (value != null) {
				update.set("providers.$[prov].contact." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("prov._id", providerId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("providers").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updateProviderAddress(ObjectId providerId, Address address) {
		Query query = new Query(Criteria.where("_id").is(providerId));

		Update update = new Update();
		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(address, Map.class);
		map.forEach((key, value) -> {

			if (value != null) {
				update.set("providers.$[prov].address." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("prov._id", providerId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("providers").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<Void> deleteProviderById(ObjectId providerId) {
		Query query = new Query(Criteria.where("_id").is(providerId));
		return reactiveMongoTemplateRef.remove(query, ProviderEO.class)
				.doOnSuccess(result -> System.out.println("Provider deleted: " + result.getDeletedCount()))
				.doOnError(error -> System.err.println("Error deleting provider: " + error.getMessage())).then();
	}

	@Override
	public Mono<ProviderEO> getProviderByEmail(String email) {
		Query query = new Query(Criteria.where("contact.email").is(email));
		return reactiveMongoTemplateRef.findOne(query, ProviderEO.class)
				.doOnSuccess(provider -> System.out.println("Provider retrieved by email: " + provider))
				.doOnError(error -> System.err.println("Error retrieving provider by email: " + error.getMessage()));
	}

	@Override
	public Mono<PatientRef> addPatientToProvider(ObjectId providerId, PatientRef patientRef) {
	    String patientId = patientRef.getPatientId();

	    Query existsQuery = new Query(Criteria.where("_id").is(providerId)
	                                          .and("patients.patientId").is(patientId));

	    return reactiveMongoTemplateRef.exists(existsQuery, ProviderEO.class)
	            .flatMap(patientAlreadyExists -> {
	                if (patientAlreadyExists) {
	                   System.err.println("Patient with ID " + patientId + " already exists for provider " + providerId);
	                    return Mono.error(new RuntimeException("Patient with ID " + patientId + " already exists for this provider."));
	                } else {
	                    Query updateQuery = new Query(Criteria.where("_id").is(providerId));
	                    Update update = new Update();
	                    update.addToSet("patients", patientRef);

	                    return reactiveMongoTemplateRef.updateFirst(updateQuery, update, ProviderEO.class)
	                            .flatMap(result -> {
	                                if (result.getModifiedCount() > 0) {
	                                    return Mono.just(patientRef);
	                                } else {
	                                    System.err.println("Failed to add patient to provider: Provider " + providerId + " not found or no modification occurred.");
	                                    return Mono.error(new RuntimeException("Failed to add patient to provider: Provider not found or no modification."));
	                                }
	                            });
	                }
	            })
	            .doOnSuccess(savedPatient -> System.out.println("Patient added to provider: " + savedPatient.getPatientId()))
	            .doOnError(error -> System.err.println("Error adding patient to provider: " + error.getMessage()));
	}
	
	
	@Override
	public Mono<ProviderEO> addPatientIdToProvider(String providerId, String patientId){
		ObjectId id = new ObjectId(providerId);
		Query query = new Query(Criteria.where("_id").is(id));
		
		Update update = new Update().push("patientIds", patientId);

        return reactiveMongoTemplateRef.findAndModify(query, update, FindAndModifyOptions.options().returnNew(true), ProviderEO.class);	}
	
	@Override
	public Mono<UpdateResult> updatePatientDetailsInProvider(ObjectId providerId, String patientId, PatientRef updatedPatientRef){
		Query query = new Query(Criteria.where("_id").is(providerId));
		
		Update update = new Update();
		
		@SuppressWarnings("unchecked")
		Map<String, Object> patientMap = new ObjectMapper().convertValue(updatedPatientRef, Map.class);
		patientMap.forEach((key, value) -> {
			if (value != null && !key.equals("patientId")) {
				update.set("patients.$[pat]." + key, value);
			}
		});
		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pat.patientId", patientId));
		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);
		return reactiveMongoTemplateRef.getCollection("providers")
				.flatMap(collection -> Mono.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated patient details in provider.");
					} else {
						System.out.println("No matching patient found or value already the same.");
					}
				}).doOnError(e -> System.err.println("Error updating patient details in provider: " + e.getMessage()));
	}

	@Override
	public Mono<Void> removePatientFromProvider(ObjectId providerId, String patientId) {
		Query query = new Query(Criteria.where("_id").is(providerId));

		Update update = new Update();
		update.pull("patients", Query.query(Criteria.where("patientId").is(patientId)));

		return reactiveMongoTemplateRef.updateFirst(query, update, ProviderEO.class)
				.doOnSuccess(
						result -> System.out.println("Patient removed from provider: " + result.getModifiedCount()))
				.doOnError(error -> System.err.println("Error removing patient from provider: " + error.getMessage()))
				.then();
	}

	@Override
	public Flux<PatientRef> getPatientsByProviderId(ObjectId providerId) {
		Query query = new Query(Criteria.where("_id").is(providerId));
		query.fields().include("patients");

		return reactiveMongoTemplateRef.find(query, ProviderEO.class)
				.flatMap(provider -> Flux.fromIterable(provider.getPatients()))
				.doOnNext(patient -> System.out.println("Patient retrieved: " + patient))
				.doOnError(error -> System.err.println("Error retrieving patients: " + error.getMessage()));
	}

	@Override
	public Mono<PatientRef> getPatientById(ObjectId providerId, String patientId) {
		Query query = new Query(Criteria.where("_id").is(providerId).and("patients.patientId").is(patientId));

		return reactiveMongoTemplateRef.findOne(query, ProviderEO.class).flatMap(provider -> {
			if (provider != null && provider.getPatients() != null) {
				return Mono.justOrEmpty(provider.getPatients().stream()
						.filter(patient -> patient.getPatientId().equals(patientId)).findFirst());
			} else {
				return Mono.empty();
			}
		}).doOnSuccess(patient -> System.out.println("Patient retrieved: " + patient))
				.doOnError(error -> System.err.println("Error retrieving patient: " + error.getMessage()));
	}

	@Override
	public Mono<Prescription> addPrescriptionToPatient(ObjectId patientId, Prescription prescription) {
    prescription.getMedicationsPrescribed().forEach(medicationPrescribed -> {
        if (medicationPrescribed.getSchedule() != null && !medicationPrescribed.getSchedule().isEmpty()) {
            MedicationTracking medicationTracking = new MedicationTracking();
            medicationTracking.setMedicationPrescribedId(medicationPrescribed.getMedicationPrescribedId());

            List<Tracker> trackers = new ArrayList<>();

            LocalDate startDate = LocalDate.parse(medicationPrescribed.getStartDate());
            LocalDate endDate = LocalDate.parse(medicationPrescribed.getEndDate());

            String periodId = medicationPrescribed.getSchedule().get(0).getPeriod();

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                boolean shouldCreateTracker = false;
                switch (periodId) {
                    case "1": // Daily
                        shouldCreateTracker = true;
                        break;
                    case "2": // Alternative
                        long daysBetween = ChronoUnit.DAYS.between(startDate, date);
                        if (daysBetween % 2 == 0) {
                            shouldCreateTracker = true;
                        }
                        break;
                    case "3": // Weekly
                        if (date.getDayOfWeek().equals(startDate.getDayOfWeek())) {
                            shouldCreateTracker = true;
                        }
                        break;
                    case "4": // Bi-weekly
                        long weeksBetween = ChronoUnit.WEEKS.between(startDate, date);
                        if (weeksBetween % 2 == 0 && date.getDayOfWeek().equals(startDate.getDayOfWeek())) {
                             shouldCreateTracker = true;
                        }
                        break;
                    case "5": // Monthly
                        if (date.getDayOfMonth() == startDate.getDayOfMonth()) {
                            shouldCreateTracker = true;
                        }
                        break;
                    default:
                        shouldCreateTracker = true;
                        break;
                }

                if (shouldCreateTracker) {
                    Tracker tracker = new Tracker();
                    tracker.setDate(date.toString());

                    List<Dose> doses = new ArrayList<>();
                    for (Schedule schedule : medicationPrescribed.getSchedule()) {
                        Dose dose = new Dose();
                        dose.setScheduleId(schedule.getScheduleId());
                        dose.setTaken(false);
                        doses.add(dose);
                    }
                    tracker.setDoses(doses);
                    trackers.add(tracker);
                }
            }

            medicationTracking.setTracker(trackers);

            if (prescription.getMedicationTracking() == null) {
                prescription.setMedicationTracking(new ArrayList<>());
            }
            prescription.getMedicationTracking().add(medicationTracking);
        }
    });

    Query query = new Query(Criteria.where("_id").is(patientId));
    Update update = new Update();
    update.push("prescriptions", prescription);

    return reactiveMongoTemplateRef.updateFirst(query, update, PatientEO.class)
            .flatMap(updateResult -> {
                if (updateResult.getModifiedCount() > 0) {
                    System.out.println("Prescription added successfully to patient with ID: " + patientId.toHexString());
                    return generateAndSaveNotificationsForPrescription(patientId, prescription)
                            .thenReturn(prescription);
                } else {
                    System.err.println("Failed to add prescription: Patient with ID " + patientId.toHexString() + " not found.");
                    return Mono.error(new RuntimeException("Patient not found with ID: " + patientId.toHexString()));
                }
            })
            .doOnError(error -> {
                System.err.println("Error adding prescription to patient " + patientId.toHexString() + ": " + error.getMessage());
            });
	}
	public Mono<Void> generateAndSaveNotificationsForPrescription(ObjectId patientId, Prescription prescription) {
	    String patientIdAsString = patientId.toHexString();

	    List<PatientNotificationsRequestsEO> notificationsToSave = new ArrayList<>();

	    for (Prescription.MedicationPrescribed medication : prescription.getMedicationsPrescribed()) {
	    	
	    	
	        String medicationName = medication.getMedication() != null ? medication.getMedication().getName() : null;

	        LocalDate startDate = LocalDate.parse(medication.getStartDate());
	        LocalDate endDate = LocalDate.parse(medication.getEndDate());

	        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
	            // Skip if dates are invalid
	            continue;
	        }

	        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;

	        if (medication.getSchedule() == null || medication.getSchedule().isEmpty()) {
	            continue;
	        }

	        for (Prescription.MedicationPrescribed.Schedule schedule : medication.getSchedule()) {
	            String scheduleId = schedule.getScheduleId();

	            for (int dayOffset = 0; dayOffset < totalDays; dayOffset++) {
	                PatientNotificationsRequestsEO notification = new PatientNotificationsRequestsEO();

	                notification.setPatientId(patientIdAsString);
	                notification.setMedicationName(medicationName);
	                notification.setScheduleId(scheduleId);
	                notification.setPeriod(schedule.getPeriod());
	                notification.setInstruction(schedule.getInstruction());
	                notification.setScheduledTime(schedule.getScheduledTime());
	                notification.setDoseTablets(schedule.getDoseTablets());
	                
	                LocalDate dateForNotification = startDate.plusDays(dayOffset);
	                notification.setDateToTakeOn(dateForNotification.toString());
	                
	                notification.setStatus("PENDING");
	                
	                notification.setMedicationPrescribed(medication);
	              
	                String message = String.format("Take %d dose(s) of %s at %s (%s). Instruction: %s", 
	                    schedule.getDoseTablets(), medicationName, schedule.getScheduledTime(), schedule.getPeriod(), schedule.getInstruction());
	                
	                notification.setMessage(message);

	                notificationsToSave.add(notification);
	            }
	        }
	    }

	    if (notificationsToSave.isEmpty()) {
	        return Mono.empty();
	    }
	    
	    return reactiveMongoTemplateRef.insertAll(notificationsToSave)
	            .then();
	}


	@Override
	public Mono<UpdateResult> modifyPrescriptionToPatient(ObjectId patientId, String prescriptionId,
			Prescription prescriptionEO) {

		Query query = new Query(Criteria.where("_id").is(patientId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> prescriptionMap = new ObjectMapper().convertValue(prescriptionEO, Map.class);

		prescriptionMap.forEach((key, value) -> {
			if (value != null && !key.equals("prescriptionId")) {
				update.set("prescriptions.$[pres]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pres.prescriptionId", prescriptionId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);

		return reactiveMongoTemplateRef.getCollection("patients")
				.flatMap(collection -> Mono
						.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)))
				.doOnSuccess(updateResult -> {
					if (updateResult.getModifiedCount() > 0) {
						System.out.println("Successfully updated");
					} else {
						System.out.println("No matching found or value already the same.");
					}
				}).doOnError(e -> System.err.println("Error updating " + e.getMessage()));
	}

	@Override
	public Flux<Prescription> getPatientPrescriptionsByProvider(ObjectId patientId, String providerId) {
		Query query = new Query(
				Criteria.where("_id").is(patientId).and("prescriptions.prescribedBy.providerId").is(providerId));

		return reactiveMongoTemplateRef.findOne(query, PatientEO.class).flatMapMany(patient -> {
			if (patient != null && patient.getPrescriptions() != null) {
				return Flux.fromStream(patient.getPrescriptions().stream().filter(
						p -> p.getPrescribedBy() != null && providerId.equals(p.getPrescribedBy().getProviderId())));
			} else {
				return Flux.empty();
			}
		}).doOnNext(prescription -> System.out.println("Prescription retrieved: " + prescription))
				.doOnError(error -> System.err.println("Error retrieving prescriptions: " + error.getMessage()));
	}

}
