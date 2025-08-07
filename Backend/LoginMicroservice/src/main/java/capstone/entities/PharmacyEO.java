package capstone.entities;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.Medication;
import capstone.entities.Constants.PharmacySoundPreference;
import capstone.entities.Constants.RaiseRefillEO;

import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "pharmacies")
public class PharmacyEO {
	
    @Id
    private ObjectId _id;
    private String name;
    private Address address;
    private Contact contact;
    private String password;
    private List<PharmacyInventory> pharmacyInventory;
    private List<RaiseRefillEO> refillMedications;
    private PharmacySoundPreference soundPreference;
    private String createdAt;
    private String updatedAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

    @Data
    public static class PharmacyInventory {
    	private String medicationId;
        private Medication medication;
        private String lastRestockDate;
        private Integer currentStockTablets;
        private Integer currentStockVolume;
        private Integer reorderThresholdVolume;
        private Integer reorderThresholdTablets;
        private String inventoryId;
        
        public PharmacyInventory() {
        	this.inventoryId = UUID.randomUUID().toString();
        }
    }

}