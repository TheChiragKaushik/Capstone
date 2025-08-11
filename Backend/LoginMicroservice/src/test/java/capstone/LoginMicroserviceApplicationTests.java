package capstone;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import capstone.entities.Constants.Contact;
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.EmergencyContact;
import capstone.entities.ProviderEO;
import capstone.entities.PharmacyEO;
import capstone.entities.RequestBody.LoginRequest;
import capstone.entities.RequestBody.SignUpRequest;
import capstone.services.LoginServices;

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

import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class LoginMicroserviceApplicationTests {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("removal")
	@MockBean
    private LoginServices loginServicesRef;

    private PatientEO patient;
    private ProviderEO provider;
    private PharmacyEO pharmacy;

    @BeforeEach
    void setup() {
        // Setup PatientEO object with some fields set
        patient = new PatientEO();
        patient.set_id(new ObjectId("64d4a4f6712b8b4e8b3d1234"));
        patient.setFirstName("Alice");
        patient.setLastName("Smith");
        patient.setGender("Female");
        Contact patientContact = new Contact();
        patientContact.setEmail("alice@capstone.com");
        patientContact.setPhone("1234567890");
        patient.setContact(patientContact);
        patient.setBloodGroup("A+");
        EmergencyContact emergencyContact = new EmergencyContact();
        emergencyContact.setName("Bob Smith");
        emergencyContact.setPhone("0987654321");
        emergencyContact.setRelationship("Brother");
        patient.setEmergencyContact(emergencyContact);

        // Setup ProviderEO object
        provider = new ProviderEO();
        provider.set_id(new ObjectId("64d4a4f6712b8b4e8b3d5678"));
        provider.setFirstName("Dr John");
        provider.setLastName("Doe");
        provider.setSpecialization("Cardiology");
        Contact providerContact = new Contact();
        providerContact.setEmail("john@capstone.care");
        providerContact.setPhone("1122334455");
        provider.setContact(providerContact);

        // Setup PharmacyEO object
        pharmacy = new PharmacyEO();
        pharmacy.set_id(new ObjectId("64d4a4f6712b8b4e8b3d9012"));
        pharmacy.setName("Health Pharmacy");
        Contact pharmacyContact = new Contact();
        pharmacyContact.setEmail("pharmacy@capstone.med");
        pharmacyContact.setPhone("6677889900");
        pharmacy.setContact(pharmacyContact);
    }

    @Test
    void testGetUserByPatientId() {
        when(loginServicesRef.findPatientById("64d4a4f6712b8b4e8b3d1234")).thenReturn(Mono.just(patient));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/logon")
                        .queryParam("PatientId", "64d4a4f6712b8b4e8b3d1234")
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Alice")
                .jsonPath("$.lastName").isEqualTo("Smith")
                .jsonPath("$.contact.email").isEqualTo("alice@capstone.com")
                .jsonPath("$.emergencyContact.name").isEqualTo("Bob Smith")
                .jsonPath("$._id").isEqualTo("64d4a4f6712b8b4e8b3d1234");
    }

    @Test
    void testGetUserByProviderId() {
        when(loginServicesRef.findProviderById("64d4a4f6712b8b4e8b3d5678")).thenReturn(Mono.just(provider));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/logon")
                        .queryParam("ProviderId", "64d4a4f6712b8b4e8b3d5678")
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Dr John")
                .jsonPath("$.specialization").isEqualTo("Cardiology")
                .jsonPath("$.contact.email").isEqualTo("john@capstone.care")
                .jsonPath("$._id").isEqualTo("64d4a4f6712b8b4e8b3d5678");
    }

    @Test
    void testGetUserByPharmacyId() {
        when(loginServicesRef.findPharmacyById("64d4a4f6712b8b4e8b3d9012")).thenReturn(Mono.just(pharmacy));

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/logon")
                        .queryParam("PharmacyId", "64d4a4f6712b8b4e8b3d9012")
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.name").isEqualTo("Health Pharmacy")
                .jsonPath("$.contact.email").isEqualTo("pharmacy@capstone.med")
                .jsonPath("$._id").isEqualTo("64d4a4f6712b8b4e8b3d9012");
    }

    @Test
    void testSignUpPatient() {
        SignUpRequest req = new SignUpRequest();
        Contact contact = new Contact();
        contact.setEmail("newpatient@capstone.com");
        req.setContact(contact);
        req.setFirstName("New");
        req.setLastName("Patient");
        req.setPassword("password123");

        when(loginServicesRef.signUpPatient(any(SignUpRequest.class))).thenReturn(Mono.just(patient));

        webTestClient.post()
                .uri("/api/logon/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Alice") // returning mocked patient object
                .jsonPath("$.contact.email").isEqualTo("alice@capstone.com");
    }

    @Test
    void testLoginPatient() {
        LoginRequest req = new LoginRequest();
        req.setEmail("alice@capstone.com");
        req.setPassword("password123");

        when(loginServicesRef.signInPatient(eq("alice@capstone.com"), eq("password123"))).thenReturn(Mono.just(patient));

        webTestClient.post()
                .uri("/api/logon/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.firstName").isEqualTo("Alice")
                .jsonPath("$.contact.email").isEqualTo("alice@capstone.com");
    }

    @Test
    void testInvalidUserTypeSignUp() {
        SignUpRequest req = new SignUpRequest();
        Contact contact = new Contact();
        contact.setEmail("user@invalid.com");
        req.setContact(contact);

        webTestClient.post()
                .uri("/api/logon/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(req)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void testInvalidUserTypeLogin() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@invalid.com");
        req.setPassword("password");

        webTestClient.post()
            .uri("/api/logon/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(req)
            .exchange()
            .expectStatus().isBadRequest();
    }}

