package capstone.services;

import capstone.entities.PatientEO.Prescription;
import reactor.core.publisher.Mono;

public interface PatientNotificationsService {
	
	
	public Mono<Prescription> addPrescriptionToPatient(String existingPatientId, Prescription prescription);

}
