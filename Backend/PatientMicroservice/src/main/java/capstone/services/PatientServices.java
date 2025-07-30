package capstone.services;



import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Address;
import capstone.entities.PatientEO.Contact;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import reactor.core.publisher.Mono;

public interface PatientServices {
	
	public Mono<PatientEO> getPatientById(ObjectId patientId);

	public Mono<PatientEO> addNewPatient(PatientEO patientsEO);
	
	public Mono<UpdateResult> updatePatientDetailsById(ObjectId patientId, PatientEO patientsEO);
	
	public Mono<UpdateResult> updatePrescriptionDetailsByPrescriptionId(
			ObjectId patientId, 
			String prescriptionId, 
			Prescription prescriptionEO
	);
	
	public Mono<UpdateResult> updateMedicationPrescribedDetailsByPrescriptionAndMedicationId(
			ObjectId patientId, 
			String prescriptionId, 
			String medicationPrescribedId, 
			MedicationPrescribed medicationPrescribedEO
	);

	public Mono<UpdateResult> updateContactDetailsById(ObjectId patientId, Contact contactEO);

	public Mono<UpdateResult> updateAddressDetailsById(ObjectId patientId, Address addressEO);

	public Mono<UpdateResult> addSingleMedicationTrackingDetailByPatientAndPrescriptionId(ObjectId patientId,
			String prescriptionId, MedicationTracking medicationTrackingEntry);

	public Mono<MedicationTracking> getMedicationTrackingEntryByPatientPrescriptionAndMedicationId(ObjectId patientId,
			String prescriptionId, String medicationPrescribedId);

	public Mono<UpdateResult> updateSingleMedicationTrackingDetailTrackerDoseByPatientPrescriptionAndMedicationId(
			ObjectId patientId, String prescriptionId, String medicationPrescribedId, String date, String scheduleId,
			Dose doseStatusEO);

	Mono<UpdateResult> updateMedicationDoseAndRecalculateTotals(ObjectId patientId, String prescriptionId,
			String medicationPrescribedId, String date, String scheduleId, Dose doseStatusUpdate);

}
