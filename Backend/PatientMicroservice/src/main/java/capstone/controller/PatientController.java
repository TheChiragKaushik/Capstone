package capstone.controller;


import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.SoundPreference;
import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.services.PatientServices;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
	
	@Autowired
	private PatientServices patientServices;
	
	@PostMapping
	public Mono<PatientEO> signUpPatient(@RequestBody PatientEO patientEO) {
		return patientServices.addNewPatient(patientEO);
	}
	
	@PutMapping("/{patientId}")
	public Mono<?> addPatientDetails(@PathVariable String patientId, @RequestBody PatientEO patientEO) {
		ObjectId id = new ObjectId(patientId);
		return patientServices.updatePatientDetailsById(id, patientEO);
	}
	
	@GetMapping("/{patientId}")
	public Mono<?> getPatientDetails(
			@PathVariable String patientId,
			@RequestParam(value = "PrescriptionId", required = false) String prescriptionId,
			@RequestParam(value = "MedicationPrescribedId", required = false) String medicationPrescribedId
			) {
		ObjectId id = new ObjectId(patientId);
		if (prescriptionId != null && medicationPrescribedId != null) {
			return patientServices.getMedicationTrackingEntryByPatientPrescriptionAndMedicationId(id, prescriptionId, medicationPrescribedId);
		}
		return patientServices.getPatientById(id);
	}
	
	@PutMapping("/{patientId}/acknowledge")
	public Mono<?> acknowledgeMedicationTrackingEntry(
			@PathVariable String patientId,
			@RequestParam(value = "PrescriptionId") String prescriptionId,
			@RequestParam(value = "MedicationPrescribedId") String medicationPrescribedId,
			@RequestParam(value = "Date") String date,
			@RequestParam(value = "ScheduleId") String scheduleId,
	        @RequestBody Dose doseStatusEO) {
		
		ObjectId id = new ObjectId(patientId);
		return patientServices.updateSingleMedicationTrackingDetailTrackerDoseByPatientPrescriptionAndMedicationId(
				id, prescriptionId, medicationPrescribedId, date, scheduleId, doseStatusEO);
	}
	
	@GetMapping("/medication-prescribed/{patientId}")
	public Mono<MedicationPrescribed> getMedicationPrescribed(
			@PathVariable String patientId,
			@RequestParam(value="PrescriptionId", required= true) String prescriptionId,
			@RequestParam(value="MedicationPrescribedId", required= true) String medicationPrescribedId){		
		return patientServices.getMedicationPrescribedByPatientPrescriptionAndMedicationId(
				patientId, prescriptionId, medicationPrescribedId);		
	}
	
	
	@PutMapping("/notification-sounds/{patientId}")
	public Mono<UpdateResult> updateSoundPreference(@PathVariable String patientId, @RequestBody SoundPreference soundPreference){
		ObjectId id = new ObjectId(patientId);
		return patientServices.updateNotificationSoundsById(id, soundPreference);
	}

}
 