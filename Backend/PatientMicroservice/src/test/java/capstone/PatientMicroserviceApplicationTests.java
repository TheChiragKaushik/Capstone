package capstone;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;


import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.mongodb.client.result.UpdateResult;

import capstone.controller.PatientController;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.SoundPreference;
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.entities.PatientNotificationsEO;
import capstone.services.PatientServices;
import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class PatientMicroserviceApplicationTests {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("removal")
	@MockBean
    private PatientServices patientServicesRef;

    private PatientEO patient;
    private UpdateResult updateResult;
    private MedicationTracking medicationTracking;
    private MedicationPrescribed medicationPrescribed;
    private PatientNotificationsEO notificationsEO;

    @BeforeEach
    void setup() {
        // Sample Patient
        patient = new PatientEO();
        patient.set_id(new ObjectId("64d4a4f6712b8b4e8b3d1111"));
        patient.setFirstName("John");
        patient.setLastName("Doe");
        Contact contact = new Contact();
        contact.setEmail("john@capstone.com");
        contact.setPhone("1234567890");
        patient.setContact(contact);

        // Mock UpdateResult
        updateResult = UpdateResult.acknowledged(1L, 1L, null);

        // Medication Tracking
        medicationTracking = new MedicationTracking();
        medicationTracking.setMedicationPrescribedId("medPrescId");

        // Medication Prescribed
        medicationPrescribed = new MedicationPrescribed();
        medicationPrescribed.setMedicationPrescribedId("medPrescId");
        medicationPrescribed.setMedicationId("medId");

        // Notifications
        notificationsEO = new PatientNotificationsEO();
    }

    @Test
    void testSignUpPatient() {
        when(patientServicesRef.addNewPatient(any(PatientEO.class))).thenReturn(Mono.just(patient));

        webTestClient.post()
            .uri("/api/patients")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(patient)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.firstName").isEqualTo("John")
            .jsonPath("$.contact.email").isEqualTo("john@capstone.com");
    }

    @Test
    void testUpdatePatientDetails() {
        when(patientServicesRef.updatePatientDetailsById(any(ObjectId.class), any(PatientEO.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri("/api/patients/{id}", patient.get_id().toHexString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(patient)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetPatientDetailsById() {
        when(patientServicesRef.getPatientById(any(ObjectId.class))).thenReturn(Mono.just(patient));

        webTestClient.get()
            .uri("/api/patients/{id}", patient.get_id().toHexString())
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.firstName").isEqualTo("John");
    }

    @Test
    void testGetMedicationTrackingEntry() {
        when(patientServicesRef.getMedicationTrackingEntryByPatientPrescriptionAndMedicationId(
            any(ObjectId.class), anyString(), anyString()))
            .thenReturn(Mono.just(medicationTracking));

        webTestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/patients/{id}")
                .queryParam("PrescriptionId", "presc1")
                .queryParam("MedicationPrescribedId", "med1")
                .build(patient.get_id().toHexString()))
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.medicationPrescribedId").isEqualTo("medPrescId");
    }

    @Test
    void testAcknowledgeMedicationTrackingEntry() {
        when(patientServicesRef.updateSingleMedicationTrackingDetailTrackerDoseByPatientPrescriptionAndMedicationId(
            any(ObjectId.class), anyString(), anyString(), anyString(), anyString(), any(Dose.class)))
            .thenReturn(Mono.just(updateResult));

        Dose dose = new Dose();
        dose.setScheduleId("schId");

        webTestClient.put()
            .uri(uriBuilder -> uriBuilder
                .path("/api/patients/{id}/acknowledge")
                .queryParam("PrescriptionId", "prescId")
                .queryParam("MedicationPrescribedId", "medId")
                .queryParam("Date", "2025-08-11")
                .queryParam("ScheduleId", "schId")
                .build(patient.get_id().toHexString()))
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(dose)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetMedicationPrescribed() {
        when(patientServicesRef.getMedicationPrescribedByPatientPrescriptionAndMedicationId(
            anyString(), anyString(), anyString()))
            .thenReturn(Mono.just(medicationPrescribed));

        webTestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/patients/medication-prescribed/{id}")
                .queryParam("PrescriptionId", "prescId")
                .queryParam("MedicationPrescribedId", "medPrescId")
                .build(patient.get_id().toHexString()))
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.medicationPrescribedId").isEqualTo("medPrescId");
    }

    @Test
    void testUpdateSoundPreference() {
        SoundPreference preference = new SoundPreference();
        preference.setDoseReminderNotificationSound("beep.mp3");

        when(patientServicesRef.updateNotificationSoundsById(any(ObjectId.class), any(SoundPreference.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri("/api/patients/notification-sounds/{id}", patient.get_id().toHexString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(preference)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateCheckedStatus_DoseReminder() {
        when(patientServicesRef.updateDoseReminderNotificationCheck(anyString(), anyString(), anyBoolean()))
            .thenReturn(Mono.just(updateResult));

        PatientController.CheckStatusPayload payload = new PatientController.CheckStatusPayload();
        payload.setPatientId("pid");
        payload.setFieldToUpdateId("fieldId");
        payload.setTaken(true);

        webTestClient.put()
            .uri("/api/patients/check?dosereminder=true")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(payload)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetAllPatientNotifications() {
        when(patientServicesRef.getAllPatientNotifications(anyString()))
            .thenReturn(Mono.just(notificationsEO));

        webTestClient.get()
            .uri("/api/patients/notifications/{id}", patient.get_id().toHexString())
            .exchange()
            .expectStatus().isOk();
    }
}
