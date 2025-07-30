package capstone.entities;

import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import lombok.Data;

@Data
public class RefillRequestsEO {
	
	private String patientId;
	private String requestDate;
	private String pharmacyId;
	private String prescriptionId;
	private MedicationPrescribed medicationPrescribed;

}
