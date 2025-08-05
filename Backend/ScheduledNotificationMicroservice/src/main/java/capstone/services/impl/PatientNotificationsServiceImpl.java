package capstone.services.impl;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.DoseReminderNotificationEO;
import capstone.entities.PatientEO;
import capstone.entities.PatientNotificationsEO;
import capstone.entities.PatientNotificationsRequestsEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed.Schedule;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.services.PatientNotificationsService;
import jakarta.annotation.PostConstruct;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@EnableScheduling
public class PatientNotificationsServiceImpl implements PatientNotificationsService {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private TaskScheduler taskSchedulerRef;

	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	private final ConcurrentHashMap<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();
	
	private final ConcurrentHashMap<String, ScheduledFuture<?>> specificPatientScheduledTasks = new ConcurrentHashMap<>();

	@PostConstruct
	public void init() {
		System.out.println("Application started. Initializing daily notification scheduling...");
		scheduleDailyNotifications();
	}
	
	public Flux<PatientNotificationsRequestsEO> getPatientNotificationsForTodayByPatientId(String patientId) {
		Query query = new Query(Criteria.where("dateToTakeOn").is(LocalDate.now().toString()).and("patientId").is(patientId));
		return reactiveMongoTemplateRef.find(query, PatientNotificationsRequestsEO.class);
	}

	public void scheduleDailyNotificationsForSpecificPatient(String patientId) {
		System.out.println("Running daily notification scheduling task for " + LocalDate.now());

		specificPatientScheduledTasks.values().forEach(task -> {
			if (!task.isDone()) {
				task.cancel(false);
			}
		});
		specificPatientScheduledTasks.clear();
		System.out.println("Cleared " + specificPatientScheduledTasks.size() + " previously scheduled tasks.");

		getPatientNotificationsForTodayByPatientId(patientId).flatMap(notification -> Mono.defer(() -> {
			try {
				LocalTime notificationTime = LocalTime.parse(notification.getScheduledTime());
				LocalDateTime scheduledDateTime = LocalDateTime.of(LocalDate.now(), notificationTime);
				Instant scheduledInstant = scheduledDateTime.atZone(ZoneId.systemDefault()).toInstant();

				if (scheduledInstant.isAfter(Instant.now())) {
					System.out.println("Attempting to schedule notification for patient " + notification.getPatientId()
							+ " at " + scheduledDateTime + " (ID: " + notification.get_id_asString() + ")");

					ScheduledFuture<?> future = taskSchedulerRef.schedule(() -> sendScheduledNotification(notification),
							scheduledInstant);

					specificPatientScheduledTasks.put(notification.get_id_asString(), future);
					return updateNotificationRequestStatus(notification.get_id_asString(), "SCHEDULED");
				} else {
					System.out.println("Skipping past notification for patient " + notification.getPatientId() + " at "
							+ scheduledDateTime + " (ID: " + notification.get_id_asString()
							+ ") - Time has already passed for today.");
					return updateNotificationRequestStatus(notification.get_id_asString(), "SKIPPED");
				}
			} catch (DateTimeParseException e) {
				System.err.println("Error parsing scheduledTime for notification ID: " + notification.get_id_asString()
						+ ". Invalid time format: '" + notification.getScheduledTime() + "'. Error: " + e.getMessage());
				return updateNotificationRequestStatus(notification.get_id_asString(), "FAILED_PARSE");
			} catch (Exception e) {
				System.err.println("An unexpected error occurred while processing notification ID: "
						+ notification.get_id_asString() + ". Error: " + e.getMessage());
				return updateNotificationRequestStatus(notification.get_id_asString(), "FAILED_SCHEDULING");
			}
		}).onErrorResume(e -> {
			System.err.println("Error processing notification in flatMap for ID " + notification.get_id_asString()
					+ ": " + e.getMessage());
			return Mono.empty();
		})).doOnError(e -> System.err.println("Error fetching notifications for daily scheduling: " + e.getMessage()))
				.doOnComplete(() -> System.out.println("Finished processing daily notifications for scheduling for "
						+ LocalDate.now() + ". Total scheduled: " + specificPatientScheduledTasks.size()))
				.subscribe();
	}
	
	
	@Override
	public Mono<Prescription> addPrescriptionToPatient(String existingPatientId, Prescription prescription) {
		ObjectId patientId = new ObjectId(existingPatientId);
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
					case "1":
						shouldCreateTracker = true;
						break;
					case "2":
						long daysBetween = ChronoUnit.DAYS.between(startDate, date);
						if (daysBetween % 2 == 0) {
							shouldCreateTracker = true;
						}
						break;
					case "3":
						if (date.getDayOfWeek().equals(startDate.getDayOfWeek())) {
							shouldCreateTracker = true;
						}
						break;
					case "4":
						long weeksBetween = ChronoUnit.WEEKS.between(startDate, date);
						if (weeksBetween % 2 == 0 && date.getDayOfWeek().equals(startDate.getDayOfWeek())) {
							shouldCreateTracker = true;
						}
						break;
					case "5":
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

		return reactiveMongoTemplateRef.updateFirst(query, update, PatientEO.class).flatMap(updateResult -> {
			if (updateResult.getModifiedCount() > 0) {
				System.out.println("Prescription added successfully to patient with ID: " + patientId.toHexString());

				Mono<Prescription> notificationMono = generateAndSaveNotificationsForPrescription(patientId,
						prescription).thenReturn(prescription);
				return notificationMono.doOnSuccess(p -> scheduleDailyNotificationsForSpecificPatient(existingPatientId));
			} else {
				System.err.println(
						"Failed to add prescription: Patient with ID " + patientId.toHexString() + " not found.");
				return Mono.error(new RuntimeException("Patient not found with ID: " + patientId.toHexString()));
			}
		}).doOnError(error -> {
			System.err.println(
					"Error adding prescription to patient " + patientId.toHexString() + ": " + error.getMessage());
		});
	}

	public Mono<PatientEO> getPatientObjectById(Object patientId) {
		Query query = new Query(Criteria.where("_id").is(patientId));
		return reactiveMongoTemplateRef.findOne(query, PatientEO.class);
	}

	public Mono<Void> generateAndSaveNotificationsForPrescription(ObjectId patientId, Prescription prescription) {
		String patientIdAsString = patientId.toHexString();

		Mono<PatientEO> patientEO = getPatientObjectById(patientId);

		return patientEO.flatMap(patient -> {
			String soundUrl = null;
			if (patient.getSoundPreference() != null) {
			    soundUrl = patient.getSoundPreference().getDoseReminderNotificationSound();
			}
			List<PatientNotificationsRequestsEO> notificationsToSave = new ArrayList<>();

			for (Prescription.MedicationPrescribed medication : prescription.getMedicationsPrescribed()) {
				String medicationName = medication.getMedication() != null ? medication.getMedication().getName()
						: null;

				LocalDate startDate = LocalDate.parse(medication.getStartDate());
				LocalDate endDate = LocalDate.parse(medication.getEndDate());

				if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
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
						notification.setPrescriptionId(prescription.getPrescriptionId());
						notification.setMedicationPrescribedId(medication.getMedicationPrescribedId());
						notification.setScheduleId(scheduleId);
						notification.setPeriod(schedule.getPeriod());
						notification.setInstruction(schedule.getInstruction());
						notification.setPrescriptionDescription(prescription.getPrescriptionForDescription());
						notification.setScheduledTime(schedule.getScheduledTime());

						if (schedule.getDoseTablets() != null) {
							notification.setDoseTablets(schedule.getDoseTablets());
						} else {
							notification.setDoseVolume(schedule.getDoseVolume());
						}

						LocalDate dateForNotification = startDate.plusDays(dayOffset);
						notification.setDateToTakeOn(dateForNotification.toString());

						notification.setStatus("PENDING");
						notification.setMedicationPrescribed(medication);

						String message = String.format("Take %d dose(s) of %s at %s (%s). Instruction: %s",
								schedule.getDoseTablets() != null ? schedule.getDoseTablets()
										: schedule.getDoseVolume(),
								medicationName, schedule.getScheduledTime(), schedule.getPeriod(),
								schedule.getInstruction());

						notification.setMessage(message);
						notification.setSoundUrl(soundUrl);

						notificationsToSave.add(notification);
					}
				}
			}

			if (notificationsToSave.isEmpty()) {
				return Mono.empty();
			}

			return reactiveMongoTemplateRef.insertAll(notificationsToSave).then();
		}).switchIfEmpty(Mono.empty());
	}

	public Flux<PatientNotificationsRequestsEO> getPatientNotificationsForToday() {
		Query query = new Query(Criteria.where("dateToTakeOn").is(LocalDate.now().toString()));
		return reactiveMongoTemplateRef.find(query, PatientNotificationsRequestsEO.class);
	}
	
	

	public Mono<UpdateResult> updateNotificationRequestStatus(String notificationRequestId, String status) {
		ObjectId id = new ObjectId(notificationRequestId);
		Query query = new Query(Criteria.where("_id").is(id));
		Update update = new Update().set("status", status);
		return reactiveMongoTemplateRef.updateFirst(query, update, PatientNotificationsRequestsEO.class)
				.doOnSuccess(result -> System.out
						.println("Updated notification status to " + status + " for ID: " + notificationRequestId))
				.doOnError(error -> System.err.println("Error updating notification status to " + status + " for ID: "
						+ notificationRequestId + ": " + error.getMessage()));
	}

	@Scheduled(cron = "0 0 0 * * *")
	public void scheduleDailyNotifications() {
		System.out.println("Running daily notification scheduling task for " + LocalDate.now());

		scheduledTasks.values().forEach(task -> {
			if (!task.isDone()) {
				task.cancel(false);
			}
		});
		scheduledTasks.clear();
		System.out.println("Cleared " + scheduledTasks.size() + " previously scheduled tasks.");

		getPatientNotificationsForToday().flatMap(notification -> Mono.defer(() -> {
			try {
				LocalTime notificationTime = LocalTime.parse(notification.getScheduledTime());
				LocalDateTime scheduledDateTime = LocalDateTime.of(LocalDate.now(), notificationTime);
				Instant scheduledInstant = scheduledDateTime.atZone(ZoneId.systemDefault()).toInstant();

				if (scheduledInstant.isAfter(Instant.now())) {
					System.out.println("Attempting to schedule notification for patient " + notification.getPatientId()
							+ " at " + scheduledDateTime + " (ID: " + notification.get_id_asString() + ")");

					ScheduledFuture<?> future = taskSchedulerRef.schedule(() -> sendScheduledNotification(notification),
							scheduledInstant);

					scheduledTasks.put(notification.get_id_asString(), future);
					return updateNotificationRequestStatus(notification.get_id_asString(), "SCHEDULED");
				} else {
					System.out.println("Skipping past notification for patient " + notification.getPatientId() + " at "
							+ scheduledDateTime + " (ID: " + notification.get_id_asString()
							+ ") - Time has already passed for today.");
					return updateNotificationRequestStatus(notification.get_id_asString(), "SKIPPED");
				}
			} catch (DateTimeParseException e) {
				System.err.println("Error parsing scheduledTime for notification ID: " + notification.get_id_asString()
						+ ". Invalid time format: '" + notification.getScheduledTime() + "'. Error: " + e.getMessage());
				return updateNotificationRequestStatus(notification.get_id_asString(), "FAILED_PARSE");
			} catch (Exception e) {
				System.err.println("An unexpected error occurred while processing notification ID: "
						+ notification.get_id_asString() + ". Error: " + e.getMessage());
				return updateNotificationRequestStatus(notification.get_id_asString(), "FAILED_SCHEDULING");
			}
		}).onErrorResume(e -> {
			System.err.println("Error processing notification in flatMap for ID " + notification.get_id_asString()
					+ ": " + e.getMessage());
			return Mono.empty();
		})).doOnError(e -> System.err.println("Error fetching notifications for daily scheduling: " + e.getMessage()))
				.doOnComplete(() -> System.out.println("Finished processing daily notifications for scheduling for "
						+ LocalDate.now() + ". Total scheduled: " + scheduledTasks.size()))
				.subscribe();
	}

	public Mono<PatientNotificationsEO> savePatientNotification(PatientNotificationsRequestsEO notificationRequest) {
		String patientId = notificationRequest.getPatientId();
		String notificationRequestId = notificationRequest.get_id_asString();

		DoseReminderNotificationEO newDoseReminder = new DoseReminderNotificationEO();
		newDoseReminder.setNotificationRequestId(notificationRequestId);
		newDoseReminder.setChecked(false);
		newDoseReminder.setNotification(notificationRequest);

		Query query = new Query(Criteria.where("patientId").is(patientId));

		Update update = new Update().inc("totalDoseReminderNotifications", 1).push("doseReminderNotifications",
				newDoseReminder);

		update.setOnInsert("patientId", patientId);

		return reactiveMongoTemplateRef
				.findAndModify(query, update, new FindAndModifyOptions().upsert(true).returnNew(true),
						PatientNotificationsEO.class)
				.switchIfEmpty(Mono.error(new RuntimeException(
						"Failed to upsert or retrieve PatientNotificationsEO for patient: " + patientId)))
				.doOnSuccess(savedNotification -> System.out
						.println("Successfully upserted PatientNotificationsEO for patient: " + patientId
								+ " and retrieved document."))
				.doOnError(e -> System.err.println(
						"Error upserting PatientNotificationsEO for patient " + patientId + ": " + e.getMessage()));
	}

	public void sendScheduledNotification(PatientNotificationsRequestsEO request) {
		try {
			messagingTemplate.convertAndSendToUser(request.getPatientId(), "/Patient/notifications", request);
			System.out.println("Scheduled Notification: Attempted to send to " + request.getPatientId()
					+ " via STOMP to /user/" + request.getPatientId() + "/Patient/notifications");

			request.setStatus("SENT");

			updateNotificationRequestStatus(request.get_id_asString(), "SENT").then(savePatientNotification(request))
					.doOnSuccess(savedNotification -> System.out.println(
							"Saved scheduled notification details for patient " + savedNotification.getPatientId()
									+ " for request ID: " + request.get_id_asString()))
					.doOnError(error -> System.err
							.println("Error in post-send operations (status update/save) for notification ID: "
									+ request.get_id_asString() + ": " + error.getMessage()))
					.subscribe(null, error -> System.err
							.println("Subscription error in sendScheduledNotification chain: " + error.getMessage()));
		} catch (Exception e) {
			System.err.println("Critical Error sending STOMP message for notification ID: " + request.get_id_asString()
					+ ": " + e.getMessage());
			updateNotificationRequestStatus(request.get_id_asString(), "FAILED_SEND").subscribe(null,
					error -> System.err.println("Error updating status to FAILED_SEND for ID: "
							+ request.get_id_asString() + ": " + error.getMessage()));
		}
	}
}