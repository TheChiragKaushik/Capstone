package capstone;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.test.web.servlet.MockMvc;

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

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
	@MockBean
    private AdminServices adminServicesRef;

    private final ObjectMapper mapper = new ObjectMapper();

    // --------- Helper data ----------
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
        a.set_id(new ObjectId("688f48cec473f189eadea806"));
        a.setName("Peanut Allergy");
        a.setType("Food Allergy");
        return a;
    }

    private AlarmRingtonesEO sampleRingtone() {
        AlarmRingtonesEO r = new AlarmRingtonesEO();
        r.set_id(new ObjectId("6890a2df83c52777f2a65306"));
        r.setName("Marimba");
        r.setUrl("data:audio/mp3;base64,...");
        return r;
    }

    // ---------- Medication Tests -------------

    @Test
    void testAddNewMedication_Success() throws Exception {
        given(adminServicesRef.addNewMedication(any(MedicationEO.class)))
                .willReturn(Mono.just(sampleMedication()));

        mockMvc.perform(post("/api/admin/medications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleMedication())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ibuprofen"));
    }

    @Test
    void testAddNewMedication_Failure() throws Exception {
        given(adminServicesRef.addNewMedication(any())).willReturn(Mono.error(new RuntimeException("DB error")));

        mockMvc.perform(post("/api/admin/medications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleMedication())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetMedicationById_Found() throws Exception {
        given(adminServicesRef.findMedicationById("1"))
                .willReturn(Mono.just(sampleMedication()));

        mockMvc.perform(get("/api/admin/medications").param("MedicationId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ibuprofen"));
    }

    @Test
    void testGetMedicationById_NotFound() throws Exception {
        given(adminServicesRef.findMedicationById("1")).willReturn(Mono.empty());

        mockMvc.perform(get("/api/admin/medications").param("MedicationId", "1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetMedicationsByType_Found() throws Exception {
        given(adminServicesRef.findMedicationsByType("Pain"))
                .willReturn(Flux.just(sampleMedication()));

        mockMvc.perform(get("/api/admin/medications").param("type", "Pain"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ibuprofen"));
    }

    @Test
    void testGetMedicationsByType_NotFound() throws Exception {
        given(adminServicesRef.findMedicationsByType("Pain")).willReturn(Flux.empty());

        mockMvc.perform(get("/api/admin/medications").param("type", "Pain"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllMedications_Found() throws Exception {
        given(adminServicesRef.findAllMedications()).willReturn(Flux.just(sampleMedication()));

        mockMvc.perform(get("/api/admin/medications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ibuprofen"));
    }

    @Test
    void testGetAllMedications_NotFound() throws Exception {
        given(adminServicesRef.findAllMedications()).willReturn(Flux.empty());

        mockMvc.perform(get("/api/admin/medications"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateMedication_Success() throws Exception {
        UpdateResult result = UpdateResult.acknowledged(1, 1L, null);
        given(adminServicesRef.updateMedicationById(eq("1"), any(MedicationEO.class))).willReturn(Mono.just(result));

        mockMvc.perform(put("/api/admin/medications").param("MedicationId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleMedication())))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteMedication_Success() throws Exception {
        given(adminServicesRef.deleteMedicationById("1")).willReturn(Mono.just(sampleMedication()));

        mockMvc.perform(delete("/api/admin/medications").param("MedicationId", "1"))
                .andExpect(status().isOk());
    }

    // ---------- Allergy Tests -------------

    @Test
    void testAddNewAllergy_Success() throws Exception {
        given(adminServicesRef.addNewAllergy(any())).willReturn(Mono.just(sampleAllergy()));

        mockMvc.perform(post("/api/admin/allergies")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleAllergy())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Peanut Allergy"));
    }

    @Test
    void testGetAllergyById_Found() throws Exception {
        given(adminServicesRef.findAllergyById("1")).willReturn(Mono.just(sampleAllergy()));

        mockMvc.perform(get("/api/admin/allergies").param("AllergyId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllAllergies_NotFound() throws Exception {
        given(adminServicesRef.findAllAllergies()).willReturn(Flux.empty());

        mockMvc.perform(get("/api/admin/allergies"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateAllergy_Success() throws Exception {
        UpdateResult result = UpdateResult.acknowledged(1, 1L, null);
        given(adminServicesRef.updateAllergyById(eq("1"), any(AllergyEO.class))).willReturn(Mono.just(result));

        mockMvc.perform(put("/api/admin/allergies").param("AllergyId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleAllergy())))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteAllergy_Success() throws Exception {
        given(adminServicesRef.deleteAllergyById("1")).willReturn(Mono.just(sampleAllergy()));

        mockMvc.perform(delete("/api/admin/allergies").param("AllergyId", "1"))
                .andExpect(status().isOk());
    }

    // ---------- Ringtone Tests -------------

    @Test
    void testAddNewRingtone_Success() throws Exception {
        given(adminServicesRef.addNewRingtone(any())).willReturn(Mono.just(sampleRingtone()));

        mockMvc.perform(post("/api/admin/ringtones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(sampleRingtone())))
                .andExpect(status().isOk());
    }

    @Test
    void testGetRingtoneById_Found() throws Exception {
        given(adminServicesRef.findRingtoneById("1")).willReturn(Mono.just(sampleRingtone()));

        mockMvc.perform(get("/api/admin/ringtones").param("RingtoneId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllRingtones_NotFound() throws Exception {
        given(adminServicesRef.findAllRingtones()).willReturn(Flux.empty());

        mockMvc.perform(get("/api/admin/ringtones"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteRingtone_Success() throws Exception {
        given(adminServicesRef.deleteRingtoneById("1")).willReturn(Mono.just(sampleRingtone()));

        mockMvc.perform(delete("/api/admin/ringtones").param("RingtoneId", "1"))
                .andExpect(status().isOk());
    }
}
