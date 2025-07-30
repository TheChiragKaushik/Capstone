package capstone.entities;


import lombok.Data;

import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

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
    
    private List<Allergy> allergies;
    
    private List<ExistingCondition> existingConditions;
    
    private EmergencyContact emergencyContact;
    
    private List<Prescription> prescriptions;
    
    private List<Provider> providers;
    
    private String password;
    private String createdAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

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
        private PrescribedBy prescribedBy;
        private List<MedicationPrescribed> medicationsPrescribed;
        private AssociatedPharmacy associatedPharmacy;
        private List<MedicationTracking> medicationTracking;

        public Prescription() {
        	this.prescriptionId = UUID.randomUUID().toString();
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
        public static class MedicationPrescribed {
            private String medicationPrescribedId;
            private Medication medication;
            private Integer totalTabletToTake;
            private Integer totalTabletsTook;
            private Integer currentTabletsInHand;
            private Integer refillAlertThreshold;
            private String startDate;
            private String endDate;
            private List<Schedule> schedule;
            private Boolean refillsAllowed;
            private Boolean refillRequired;
            private List<RefillQuantity> refillQuantity;
            
            public MedicationPrescribed() {
				this.medicationPrescribedId = UUID.randomUUID().toString();
			}

            @Data
            public static class Medication {
                private String medicationId;
                private String name;
                private String description;
                private Integer oneTablet;
                private Integer tabletsInPack;
                private String unitMeasure;
            }

            @Data
            public static class Schedule {
                private String scheduleId;
                private String period;
                private String instruction;
                private String scheduledTime;
                private Integer doseTablets;
                
                
                public Schedule() {
                	this.scheduleId = UUID.randomUUID().toString();
                }
            }

            @Data
            public static class RefillQuantity {
                private String refillId;
                private Boolean requestStatus;
                private Integer tabletsRefilled;
                
                public RefillQuantity() {
					this.refillId = UUID.randomUUID().toString();
				}
            }
        }

        @Data
        public static class AssociatedPharmacy {
            private String pharmacyId;
            private String name;
            private Address address;
            private Contact contact;
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
                    private String actualTimeTaken;
                }
            }
        }
    }

    @Data
    public static class Provider {
        private String providerId;
        private String firstName;
        private String lastName;
        private String specialization;
        private Contact contact;
        private Address address;
    }
}