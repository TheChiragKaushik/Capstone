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

import capstone.entities.Constants.DoseStatusSetRequest;
import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.services.PatientNotificationsService;
import capstone.services.PatientPharmacyRefillService;
import capstone.services.PatientRefillNotifications;
import capstone.services.PharmacyPatientRequestRefillService;
import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class ScheduledNotificationMicroserviceApplicationTests {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("removal")
	@MockBean
    private PatientNotificationsService patientNotificationsServiceRef;

    @SuppressWarnings("removal")
	@MockBean
    private PatientRefillNotifications patientRefillNotificationsRef;

    @SuppressWarnings("removal")
	@MockBean
    private PatientPharmacyRefillService patientPharmacyRefillServiceRef;

    @SuppressWarnings("removal")
	@MockBean
    private PharmacyPatientRequestRefillService pharmacyPatientRequestRefillServiceRef;

    private static final String VALID_PATIENT_ID = "64d4a4f6712b8b4e8b3d1111";
    private Prescription prescription;
    private UpdateResult updateResult;
    private RaiseRefillEO raiseRefillEO;

    @BeforeEach
    void setup() {
        // Sample Prescription
        prescription = new Prescription();
        prescription.setPrescriptionForDescription("For testing");

        // Mongo UpdateResult
        updateResult = UpdateResult.acknowledged(1L, 1L, null);

        // Sample RaiseRefillEO
        raiseRefillEO = new RaiseRefillEO();
        raiseRefillEO.setPatientId(VALID_PATIENT_ID);
        raiseRefillEO.setMedicationName("TestMed");
    }

    @Test
    void testAddNewPrescription() {
        when(patientNotificationsServiceRef.addPrescriptionToPatient(anyString(), any(Prescription.class)))
                .thenReturn(Mono.just(prescription));

        webTestClient.put()
                .uri("/api/scheduled/prescriptions/{patientId}", VALID_PATIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(prescription)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.prescriptionForDescription").isEqualTo("For testing");
    }

    @Test
    void testSetDoseStatus() {
        DoseStatusSetRequest req = new DoseStatusSetRequest();
        req.setPrescriptionId("prescId");
        req.setMedicationPrescribedId("medId");
        req.setDate("2025-08-11");
        req.setScheduleId("schId");
        Dose dose = new Dose();
        dose.setScheduleId("schId");
        req.setDoseStatusUpdate(dose);

        when(patientRefillNotificationsRef.updateMedicationDoseAndRecalculateTotals(
                anyString(), anyString(), anyString(), anyString(), anyString(), any(Dose.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/scheduled/status/{patientId}", VALID_PATIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateRefillManagement() {
        when(patientRefillNotificationsRef.updateRefillMedicationsInPatient(
                any(ObjectId.class), any(RaiseRefillEO.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/scheduled/test/{patientId}", VALID_PATIENT_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(raiseRefillEO)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testRequestRefillFromSelectedPharmacy() {
        when(patientPharmacyRefillServiceRef.patientRaiseRefillRequestNotificationToPharmacy(any(RaiseRefillEO.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/scheduled/requestrefill")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(raiseRefillEO)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testApproveRefillRequest() {
        when(pharmacyPatientRequestRefillServiceRef.approveRefillRequest(any(RaiseRefillEO.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/scheduled/approve-request")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(raiseRefillEO)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }
}
