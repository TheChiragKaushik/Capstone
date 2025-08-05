package capstone.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import reactor.core.publisher.Mono;

public interface PatientRefillNotifications {
	
	public Mono<UpdateResult> updateMedicationDoseAndRecalculateTotals(
	        String inputPatientId,
	        String prescriptionId,
	        String medicationPrescribedId,
	        String date,
	        String scheduleId,
	        Dose doseStatusUpdate);

	public Mono<UpdateResult> updateRefillMedicationsInPatient(ObjectId patientId, RaiseRefillEO raiseRefillEO);

}
