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

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.PatientRef;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.ProviderEO;
import capstone.services.ProviderServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class ProviderMicroserviceApplicationTests {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("removal")
	@MockBean
    private ProviderServices providerServicesRef;

    private ProviderEO provider;
    private UpdateResult updateResult;
    private PatientRef patientRef;
    private Prescription prescription;

    @BeforeEach
    void setup() {
        // Sample Provider
        provider = new ProviderEO();
        provider.set_id(new ObjectId("64d4a4f6712b8b4e8b3d7777"));
        provider.setFirstName("Dr John");
        provider.setLastName("Smith");
        provider.setSpecialization("Cardiology");

        Contact contact = new Contact();
        contact.setEmail("dr.john@capstone.care");
        contact.setPhone("1112223333");
        provider.setContact(contact);

        Address address = new Address();
        address.setCity("New York");
        provider.setAddress(address);

        // Sample UpdateResult
        updateResult = UpdateResult.acknowledged(1L, 1L, null);

        // Sample PatientRef
        patientRef = new PatientRef();
        patientRef.setPatientId("pid1");
        patientRef.setFirstName("Alice");
        patientRef.setLastName("Brown");

        // Sample Prescription
        prescription = new Prescription();
        prescription.setPrescriptionForDescription("For Heart Health");
    }

    @Test
    void testGetProviderById() {
        when(providerServicesRef.getProviderById(any(ObjectId.class)))
                .thenReturn(Mono.just(provider));

        webTestClient.get()
                .uri("/api/providers/{id}", provider.get_id().toHexString())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Dr John")
                .jsonPath("$.contact.email").isEqualTo("dr.john@capstone.care");
    }

    @Test
    void testGetProviderById_NotFound() {
        when(providerServicesRef.getProviderById(any(ObjectId.class)))
                .thenReturn(Mono.empty());

        webTestClient.get()
                .uri("/api/providers/{id}", provider.get_id().toHexString())
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void testSignUpProvider() {
        when(providerServicesRef.addNewProvider(any(ProviderEO.class)))
                .thenReturn(Mono.just(provider));

        webTestClient.post()
                .uri("/api/providers")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(provider)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.specialization").isEqualTo("Cardiology");
    }

    @Test
    void testUpdateProviderDetails() {
        when(providerServicesRef.updateProviderById(any(ObjectId.class), any(ProviderEO.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/providers/{id}", provider.get_id().toHexString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(provider)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateContactDetails() {
        when(providerServicesRef.updateProviderContact(any(ObjectId.class), any(Contact.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/providers/{id}/contactdetails", provider.get_id().toHexString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(provider.getContact())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateAddressDetails() {
        when(providerServicesRef.updateProviderAddress(any(ObjectId.class), any(Address.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri("/api/providers/{id}/addressdetails", provider.get_id().toHexString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(provider.getAddress())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testDeleteProvider() {
        when(providerServicesRef.deleteProviderById(any(ObjectId.class)))
                .thenReturn(Mono.empty());

        webTestClient.delete()
                .uri("/api/providers/{id}", provider.get_id().toHexString())
                .exchange()
                .expectStatus().isOk();
    }

    @Test
    void testAddPatientIdToProvider() {
        when(providerServicesRef.addPatientIdToProvider(anyString(), anyString()))
                .thenReturn(Mono.just(provider));

        webTestClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/providers/{id}/patients")
                        .queryParam("PatientId", "pid1")
                        .build(provider.get_id().toHexString()))
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Dr John");
    }

    @Test
    void testAddPrescriptionToPatient() {
        when(providerServicesRef.addPrescriptionToPatient(any(ObjectId.class), any(Prescription.class)))
                .thenReturn(Mono.just(prescription));

        webTestClient.put()
                .uri("/api/providers/prescriptions/{id}", "64d4a4f6712b8b4e8b3d7777")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(prescription)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.prescriptionForDescription").isEqualTo("For Heart Health");
    }

    @Test
    void testModifyPrescriptionToPatient() {
        when(providerServicesRef.modifyPrescriptionToPatient(any(ObjectId.class), anyString(), any(Prescription.class)))
                .thenReturn(Mono.just(updateResult));

        webTestClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/providers/prescriptions/{id}")
                        .queryParam("Modify", "true")
                        .queryParam("PrescriptionId", "prescid123")
                        .build("64d4a4f6712b8b4e8b3d7777"))  
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(prescription)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetPatientPrescriptionsByProvider() {
        when(providerServicesRef.getPatientPrescriptionsByProvider(any(ObjectId.class), anyString()))
                .thenReturn(Flux.just(prescription));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/providers/prescriptions/{patientId}")
                        .queryParam("ProviderId", "prov1")
                        .build(new ObjectId().toHexString()))
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$[0].prescriptionForDescription").isEqualTo("For Heart Health");
    }
}
