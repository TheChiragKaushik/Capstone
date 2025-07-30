package capstone.entities;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
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
    private Instant createdAt;
    private Instant updatedAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

    @Data
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    public static class Contact {
        private String email;
        private String phone;
    }

    @Data
    public static class PharmacyInventory {
        private Medication medication;
        private Instant lastRestockDate;
        private Integer currentStockTablets;
        private Integer reorderThresholdTablets;
        private String inventoryId;
        
        public PharmacyInventory() {
        	this.inventoryId = UUID.randomUUID().toString();
        }
    }

    @Data
    public static class Medication {
        private String medicationId;
        private String name;
        private String description;
        private Integer oneUnit;
        private List<PotentialAllergy> potentialAllergiess;
        private String unitMeasure;
    }

    @Data
    public static class PotentialAllergy {
        private ObjectId allergyId;
        private String name;
        private String type;
        private String description;
        private List<String> sideEffects;
    }
}