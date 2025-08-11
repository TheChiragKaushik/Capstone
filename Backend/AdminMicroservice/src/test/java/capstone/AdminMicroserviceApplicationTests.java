package capstone;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import com.mongodb.client.result.UpdateResult;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

import capstone.entities.AlarmRingtonesEO;
import capstone.entities.AllergyEO;
import capstone.entities.MedicationEO;
import capstone.services.AdminServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class AdminMicroserviceApplicationTests {


    @SuppressWarnings("removal")
	@MockBean
    private AdminServices adminServicesRef;
    
    @Autowired
    private WebTestClient webTestClient;


    @Test
    void testAddNewMedication_Success() {
        given(adminServicesRef.addNewMedication(any(MedicationEO.class)))
                .willReturn(Mono.just(sampleMedication()));

        webTestClient.post()
                .uri("/api/admin/medications")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleMedication())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.name").isEqualTo("Ibuprofen");
    }

    @Test
    void testAddNewMedication_Failure() {
        given(adminServicesRef.addNewMedication(any()))
                .willReturn(Mono.error(new RuntimeException("DB error")));

        webTestClient.post()
                .uri("/api/admin/medications")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleMedication())
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void testGetMedicationById_Found() {
        given(adminServicesRef.findMedicationById("1"))
                .willReturn(Mono.just(sampleMedication()));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("MedicationId", "1").build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.name").isEqualTo("Ibuprofen");
    }

    @Test
    void testGetMedicationById_NotFound() {
        given(adminServicesRef.findMedicationById("1")).willReturn(Mono.empty());

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("MedicationId", "1").build())
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testGetMedicationsByType_Found() {
        given(adminServicesRef.findMedicationsByType("Pain"))
                .willReturn(Flux.just(sampleMedication()));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("type", "Pain").build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].name").isEqualTo("Ibuprofen");
    }

    @Test
    void testGetMedicationsByType_NotFound() {
        given(adminServicesRef.findMedicationsByType("Pain")).willReturn(Flux.empty());

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("type", "Pain").build())
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testGetAllMedications_Found() {
        given(adminServicesRef.findAllMedications()).willReturn(Flux.just(sampleMedication()));

        webTestClient.get()
                .uri("/api/admin/medications")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].name").isEqualTo("Ibuprofen");
    }

    @Test
    void testGetAllMedications_NotFound() {
        given(adminServicesRef.findAllMedications()).willReturn(Flux.empty());

        webTestClient.get()
                .uri("/api/admin/medications")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testUpdateMedication_Success() {
        UpdateResult result = UpdateResult.acknowledged(1, 1L, null);
        given(adminServicesRef.updateMedicationById(eq("1"), any(MedicationEO.class)))
                .willReturn(Mono.just(result));

        webTestClient.put()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("MedicationId", "1").build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleMedication())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testDeleteMedication_Success() {
        given(adminServicesRef.deleteMedicationById("1")).willReturn(Mono.just(sampleMedication()));

        webTestClient.delete()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/medications")
                        .queryParam("MedicationId", "1").build())
                .exchange()
                .expectStatus().isOk();
    }

    // ---------- Allergy Tests -------------

    @Test
    void testAddNewAllergy_Success() {
        given(adminServicesRef.addNewAllergy(any())).willReturn(Mono.just(sampleAllergy()));

        webTestClient.post()
                .uri("/api/admin/allergies")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleAllergy())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.name").isEqualTo("Peanut Allergy");
    }

    @Test
    void testGetAllergyById_Found() {
        given(adminServicesRef.findAllergyById("1")).willReturn(Mono.just(sampleAllergy()));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/allergies")
                        .queryParam("AllergyId", "1").build())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testGetAllAllergies_NotFound() {
        given(adminServicesRef.findAllAllergies()).willReturn(Flux.empty());

        webTestClient.get()
                .uri("/api/admin/allergies")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testUpdateAllergy_Success() {
        UpdateResult result = UpdateResult.acknowledged(1, 1L, null);
        given(adminServicesRef.updateAllergyById(eq("1"), any(AllergyEO.class)))
                .willReturn(Mono.just(result));

        webTestClient.put()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/allergies")
                        .queryParam("AllergyId", "1").build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleAllergy())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testDeleteAllergy_Success() {
        given(adminServicesRef.deleteAllergyById("1")).willReturn(Mono.just(sampleAllergy()));

        webTestClient.delete()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/allergies")
                        .queryParam("AllergyId", "1").build())
                .exchange()
                .expectStatus().isOk();
    }

    // ---------- Ringtone Tests -------------

    @Test
    void testAddNewRingtone_Success() {
        given(adminServicesRef.addNewRingtone(any())).willReturn(Mono.just(sampleRingtone()));

        webTestClient.post()
                .uri("/api/admin/ringtones")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(sampleRingtone())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testGetRingtoneById_Found() {
        given(adminServicesRef.findRingtoneById("1")).willReturn(Mono.just(sampleRingtone()));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/ringtones")
                        .queryParam("RingtoneId", "1").build())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testGetAllRingtones_NotFound() {
        given(adminServicesRef.findAllRingtones()).willReturn(Flux.empty());

        webTestClient.get()
                .uri("/api/admin/ringtones")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testDeleteRingtone_Success() {
        given(adminServicesRef.deleteRingtoneById("1")).willReturn(Mono.just(sampleRingtone()));

        webTestClient.delete()
                .uri(uriBuilder -> uriBuilder.path("/api/admin/ringtones")
                        .queryParam("RingtoneId", "1").build())
                .exchange()
                .expectStatus().isOk();
    }

    // ---------- Sample Data Methods -------------

    private MedicationEO sampleMedication() {
        MedicationEO m = new MedicationEO();
        m.set_id(new ObjectId("688dba45c473f189eadea7d1"));
        m.setName("Ibuprofen");
        m.setDescription("Pain reliever");
        m.setOneTablet(200);
        m.setUnitMeasure("mg");
        m.setType("Pain Relievers");
        return m;
    }

    private AllergyEO sampleAllergy() {
        AllergyEO a = new AllergyEO();
        a.set_id(new ObjectId("688dba45c473f189eadea7d2"));
        a.setName("Peanut Allergy");
        a.setDescription("Allergic to peanuts");
        return a;
    }

    private AlarmRingtonesEO sampleRingtone() {
    	AlarmRingtonesEO r = new AlarmRingtonesEO();
        r.set_id(new ObjectId("688dba45c473f189eadea7d3"));
        r.setName("Classic Tone");
        r.setUrl("Default ringtone");
        return r;
    }
}
