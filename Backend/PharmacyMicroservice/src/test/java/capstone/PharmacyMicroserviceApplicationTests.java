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

import capstone.controller.PharmacyController.CheckStatusPayload;
import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.PharmacySoundPreference;
import capstone.entities.PharmacyEO;
import capstone.entities.PharmacyEO.PharmacyInventory;
import capstone.entities.PharmacyNotificationsEO;
import capstone.services.PharmacyServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
class PharmacyMicroserviceApplicationTests {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("removal")
	@MockBean
    private PharmacyServices pharmacyServicesRef;

    private PharmacyEO pharmacy;
    private UpdateResult updateResult;
    private PharmacyInventory inventory;
    private PharmacySoundPreference soundPreference;
    private PharmacyNotificationsEO notificationsEO;

    private static final String VALID_ID = "64d4a4f6712b8b4e8b3d9999"; // 24-char hex

    @BeforeEach
    void setup() {
        // Sample Pharmacy
        pharmacy = new PharmacyEO();
        pharmacy.set_id(new ObjectId(VALID_ID));
        pharmacy.setName("Healthy Life Pharmacy");

        Contact contact = new Contact();
        contact.setEmail("pharmacy@capstone.med");
        contact.setPhone("9876543210");
        pharmacy.setContact(contact);

        Address addr = new Address();
        addr.setCity("New York");
        pharmacy.setAddress(addr);

        // UpdateResult mock
        updateResult = UpdateResult.acknowledged(1L, 1L, null);

        // Inventory
        inventory = new PharmacyInventory();
        inventory.setMedicationId("med123");
        inventory.setCurrentStockTablets(100);

        // Sound preference
        soundPreference = new PharmacySoundPreference();
        soundPreference.setInventoryUpdateNotificationSound("ding.mp3");

        // Notifications
        notificationsEO = new PharmacyNotificationsEO();
    }

    @Test
    void testUpdatePharmacy() {
        when(pharmacyServicesRef.updatePharmacy(any(ObjectId.class), any(PharmacyEO.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri("/api/pharmacy/{id}", VALID_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(pharmacy)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetPharmacyById() {
        when(pharmacyServicesRef.getPharmacyById(any(ObjectId.class)))
            .thenReturn(Mono.just(pharmacy));

        webTestClient.get()
            .uri("/api/pharmacy/{id}", VALID_ID)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.name").isEqualTo("Healthy Life Pharmacy")
            .jsonPath("$.contact.email").isEqualTo("pharmacy@capstone.med");
    }

    @Test
    void testGetPharmacyById_NotFound() {
        when(pharmacyServicesRef.getPharmacyById(any(ObjectId.class))).thenReturn(Mono.empty());

        webTestClient.get()
            .uri("/api/pharmacy/{id}", VALID_ID)
            .exchange()
            .expectStatus().isNotFound();
    }

    @Test
    void testAddInventoryToPharmacy() {
        when(pharmacyServicesRef.addInventoryToPharmacy(anyString(), any(PharmacyInventory.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri("/api/pharmacy/inventory/{id}", VALID_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(inventory)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateInventoryOfPharmacy() {
        when(pharmacyServicesRef.updatePharmacyInventory(anyString(), anyString(), any(PharmacyInventory.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri(uriBuilder -> uriBuilder
                .path("/api/pharmacy/inventory/{id}")
                .queryParam("InventoryId", inventory.getInventoryId())
                .build(VALID_ID))
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(inventory)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetAllPharmaciesForMedication() {
        when(pharmacyServicesRef.getAllPharmacyProvidingCertainMedication(anyString()))
            .thenReturn(Flux.just(pharmacy));

        webTestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/pharmacy/medication")
                .queryParam("MedicationId", "med123")
                .build())
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$[0].name").isEqualTo("Healthy Life Pharmacy");
    }

    @Test
    void testUpdateSoundPreference() {
        when(pharmacyServicesRef.updateNotificationSoundsById(any(ObjectId.class), any(PharmacySoundPreference.class)))
            .thenReturn(Mono.just(updateResult));

        webTestClient.put()
            .uri("/api/pharmacy/notification-sounds/{id}", VALID_ID)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(soundPreference)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateCheckedStatus_Inventory() {
        when(pharmacyServicesRef.updateInventoryRestockReminderNotificationCheck(anyString(), anyString()))
            .thenReturn(Mono.just(updateResult));

        CheckStatusPayload payload = new CheckStatusPayload();
        payload.setPharmacyId(VALID_ID);
        payload.setFieldToUpdateId("field123");

        webTestClient.put()
            .uri("/api/pharmacy/check?inventory=true")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(payload)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testUpdateCheckedStatus_RefillRequest() {
        when(pharmacyServicesRef.updateRefillRequestReminderNotificationCheck(anyString(), anyString()))
            .thenReturn(Mono.just(updateResult));

        CheckStatusPayload payload = new CheckStatusPayload();
        payload.setPharmacyId(VALID_ID);
        payload.setFieldToUpdateId("field456");

        webTestClient.put()
            .uri("/api/pharmacy/check?refillrequest=true")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(payload)
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$.modifiedCount").isEqualTo(1);
    }

    @Test
    void testGetAllPharmacyNotifications() {
        when(pharmacyServicesRef.getAllPharmacyNotifications(anyString()))
            .thenReturn(Mono.just(notificationsEO));

        webTestClient.get()
            .uri("/api/pharmacy/notifications/{id}", VALID_ID)
            .exchange()
            .expectStatus().isOk();
    }
}
