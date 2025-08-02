package capstone.entities;


import lombok.Data;

import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Allergy;
import capstone.entities.Constants.AssociatedPharmacy;
import capstone.entities.Constants.AssociatedProvider;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.Medication;
import capstone.entities.Constants.Refill;

@Data
@Document(collection = "patients")
public class PatientEO {
	
	@Id
    private ObjectId _id;
	
    private Contact contact;
    private String firstName;
    private String lastName;
    private String gender;
    private Address address;
    private String bloodGroup;
    private String dateOfBirth;
    
    private List<String> allergyIds;
    private List<Allergy> allergies;
    
    private List<ExistingCondition> existingConditions;
    
    private EmergencyContact emergencyContact;
    
    private List<Prescription> prescriptions;
    

    private List<String> providerIds;
    private List<AssociatedProvider> providers;
    
    private List<Refill> refillMedications;
    
    private String password;
    private String createdAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

    @Data
    public static class ExistingCondition {
        private String name;
        private String severity;
    }

    @Data
    public static class EmergencyContact {
        private String name;
        private String relationship;
        private String phone;
    }

    @Data
    public static class Prescription {
        private String prescriptionId;
        private String providerId;
        private AssociatedProvider prescribedBy;
        private List<MedicationPrescribed> medicationsPrescribed;
        private String associatedPharmacyId;
        private AssociatedPharmacy associatedPharmacy;
        private List<MedicationTracking> medicationTracking;

        public Prescription() {
        	this.prescriptionId = UUID.randomUUID().toString();
        }
        
        

        @Data
        public static class MedicationPrescribed {
            private String medicationPrescribedId;
            private String medicationId;
            private Medication medication;
            private Integer totalTabletToTake;
            private Integer totalTabletsTook;
            private Integer currentTabletsInHand;
            private Integer totalVolumeToTake;
            private Integer totalVolumeTook;
            private Integer currentVolumeInhand;
            private Integer refillAlertThreshold;
            private String startDate;
            private String endDate;
            private List<Schedule> schedule;
            private Boolean refillsAllowed;
            private Boolean refillRequired;            
            
            public MedicationPrescribed() {
				this.medicationPrescribedId = UUID.randomUUID().toString();
			}

            

            @Data
            public static class Schedule {
                private String scheduleId;
                private String period;
                private String instruction;
                private String scheduledTime;
                private Integer doseTablets;
                private String doseVolume;
                
                
                public Schedule() {
                	this.scheduleId = UUID.randomUUID().toString();
                }
            }
        }

        @Data
        public static class MedicationTracking {
            private String medicationPrescribedId;
            private List<Tracker> tracker;

            @Data
            public static class Tracker {
                private String date;
                private List<Dose> doses;

                @Data
                public static class Dose {
                    private String scheduleId;
                    private Boolean taken;
                    private Integer tabletsTaken;
                    private Integer volumeTaken;
                    private String actualTimeTaken;
                }
            }
        }
    }
}