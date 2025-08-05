package capstone.entities;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
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
		private String unitMeasure;
		private Integer volumePerDose;
		private String liquidUnitMeasure;
		private String type;
	}

	@Data
	public static class PatientRef {
		private String patientId;
		private Contact contact;
		private String firstName;
		private String lastName;
		private Address address;
		private String gender;
		private String dateOfBirth;

	}

	public static final List<String> MedicationType = Arrays.asList("Pain Relievers (Analgesics)", "Antibiotics",
			"Antivirals", "Antifungals", "Antihistamines", "Antidepressants", "Antianxiety Medications",
			"Antihypertensives (for Blood Pressure)", "Antidiabetics (for Diabetes)", "Statins (for Cholesterol)",
			"Anti-inflammatories", "Antacids", "Anticonvulsants", "Antineoplastics (for Cancer)",
			"Hormone Replacements", "Bronchodilators (for Respiratory issues)", "Anticoagulants (Blood Thinners)");

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
		private String medicationId;
		private Medication medication;
		private String prescriptionId;
		private String medicationPrescribedId;
		private String status;
		private Integer refillQuantityTablets;
		private Integer refillQuantityVolume;
		private String requestDate;
		private String lastRefillDate;

		public Refill() {
			this.refillId = UUID.randomUUID().toString();
		}
	}
	
	
	@Data
	public static class DoseStatusSetRequest {
		private String prescriptionId;
		private String medicationPrescribedId;
		private String date;
		private String scheduleId;
		private Dose doseStatusUpdate;
	}
	
	@Data
	public static class RefillMedications{
		
		private String refillMedications;
		private RaiseRefillEO raiseRefillEO;
		
		public RefillMedications() {
	    	this.refillMedications = UUID.randomUUID().toString();
	    }
		
	}
	
	@Data
	public static class RaiseRefillEO {
		
		private String raiseRefillId;
		private String patientId;
		private String medicationId;
		private String providerId;
		private String medicationName;
		private String prescriptionId;
		private String prescriptionForDescription;
		private MedicationPrescribed medicationPrescribed;
		private String medicationPrescribedId;
		private Integer doseTabletsRequired;
		private Integer doseVolumeRequired;
		private String message;
	    private String status;
	    private String requestDate;
	    private String pharmacyId;
	    private Integer refillQuantityTablets;
	    private Integer refillQuantityVolume;
	    private String lastRefillDate;
	    private String soundUrl;
	    
	    
	    public RaiseRefillEO() {
	    	this.raiseRefillId = UUID.randomUUID().toString();
	    }

	}

	@Data
	public static class SoundPreference {
		private String doseReminderNotificationSound;

		private String refillReminderNotificationSound;
		
	}
}
