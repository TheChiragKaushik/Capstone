package capstone.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.DoseStatusSetRequest;
import capstone.entities.Constants.RaiseRefillEO;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.PatientEO.Prescription.MedicationTracking.Tracker.Dose;
import capstone.services.PatientNotificationsService;
import capstone.services.PatientPharmacyRefillService;
import capstone.services.PatientRefillNotifications;
import capstone.services.PharmacyPatientRequestRefillService;
import reactor.core.publisher.Mono;


@Controller
@RestController
@RequestMapping("/api/scheduled")
public class ScheduledNotificationController { 
    
	@Autowired
    private PatientNotificationsService patientNotificationsServiceRef;
	
	@Autowired
	private PatientRefillNotifications patientRefillNotificationsRef;
	
	@Autowired
	private PatientPharmacyRefillService patientPharmacyRefillServiceRef;
	
	@Autowired
	private PharmacyPatientRequestRefillService pharmacyPatientRequestRefillServiceRef;
	
	
	@PutMapping("/prescriptions/{patientId}")
	public Mono<Prescription> addNewPrescription(
			@PathVariable String patientId,
			@RequestBody Prescription prescription){
		return patientNotificationsServiceRef.addPrescriptionToPatient(patientId, prescription)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to add new Prescription and Notifications: " + ex.getMessage(), ex)));
	}
	
	@PutMapping("/status/{patientId}")
	public Mono<UpdateResult> setDoseStatus(@PathVariable String patientId, @RequestBody DoseStatusSetRequest doseStatusSetRequest){
		String prescriptionId = doseStatusSetRequest.getPrescriptionId();
		
		String medicationPrescribedId = doseStatusSetRequest.getMedicationPrescribedId();
		String date = doseStatusSetRequest.getDate();
		String scheduleId = doseStatusSetRequest.getScheduleId();
		Dose doseStatusUpdate = doseStatusSetRequest.getDoseStatusUpdate();
		
		return patientRefillNotificationsRef.updateMedicationDoseAndRecalculateTotals(patientId,
				prescriptionId,medicationPrescribedId, date, scheduleId,doseStatusUpdate )
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to set Dose status: " + ex.getMessage(), ex)));
	}
	
	
	@PutMapping("/test/{patientId}")
	public Mono<UpdateResult> updateRefillManagement(@PathVariable String patientId, @RequestBody RaiseRefillEO raiseRefillEO){
		ObjectId id = new ObjectId(patientId);
		
		return patientRefillNotificationsRef.updateRefillMedicationsInPatient(id, raiseRefillEO);
	}
	
	
	@PutMapping("/requestrefill")
	public Mono<UpdateResult> requestRefillFromSelectedPharmacy(@RequestBody RaiseRefillEO raiseRefillEO){
		return patientPharmacyRefillServiceRef.patientRaiseRefillRequestNotificationToPharmacy(raiseRefillEO);
	}
	
	
	@PutMapping("/approve-request")
    public Mono<UpdateResult> approveRefillRequest(@RequestBody RaiseRefillEO raiseRefillEO) {
        return pharmacyPatientRequestRefillServiceRef.approveRefillRequest(raiseRefillEO)
                .doOnError(e -> System.err.println("Error approving refill request: " + e.getMessage()));
    }
}


