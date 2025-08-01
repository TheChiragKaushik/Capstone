package capstone.entities;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class Constants {
	
	@Data
    public static class Contact {
        private String email;
        private String phone;
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
    public static class Allergy {
        private String allergyId;
        private String name;
        private String type;
        private String description;
        private List<String> sideEffects;
    }
	
	
	@Data
    public static class PrescribedBy {
        private String providerId;
        private String firstName;
        private String lastName;
        private String specialization;
        private Contact contact; 
        private Address address;
    }
	
	
	@Data
    public static class Medication {
        private String medicationId;
        private String name;
        private String description;
        private Integer oneTablet;
        private Integer tabletsInPack;
        private String unitMeasure;
        private Integer volumePerDose;   
        private Integer totalVolume;     
        private String liquidUnitMeasure;
        private String type;
    }
	
	public static final List<String> MedicationType = Arrays.asList(
	        "Pain Relievers (Analgesics)",
	        "Antibiotics",
	        "Antivirals",
	        "Antifungals",
	        "Antihistamines",
	        "Antidepressants",
	        "Antianxiety Medications",
	        "Antihypertensives (for Blood Pressure)",
	        "Antidiabetics (for Diabetes)",
	        "Statins (for Cholesterol)",
	        "Anti-inflammatories",
	        "Antacids",
	        "Anticonvulsants",
	        "Antineoplastics (for Cancer)",
	        "Hormone Replacements",
	        "Bronchodilators (for Respiratory issues)",
	        "Anticoagulants (Blood Thinners)"
	    );
	
	
	@Data
    public static class AssociatedPharmacy {
        private String pharmacyId;
        private String name;
        private Address address;
        private Contact contact;
    }
	
	@Data
    public static class AssociatedProvider {
        private String providerId;
        private String firstName;
        private String lastName;
        private String specialization;
        private Contact contact;
        private Address address;
    }
	
	
	@Data
	public static class Refill {
		private String refillId;
		private String patientId;
    	private String pharmacyId;
    	private Medication medication;
    	private String status;
    	private Integer refillQuantity;
    	private String requestDate;
    	private String lastRefillDate;
    	
    	public Refill() {
    		this.refillId = UUID.randomUUID().toString();
    	}    		
	}


}
