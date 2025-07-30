package capstone.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.PatientEO.Prescription.MedicationPrescribed.RefillQuantity;
import capstone.entities.RefillRequestsEO;
import reactor.core.publisher.Mono;

public interface CustomNotificationsServices {
	
	public Mono<UpdateResult> addNewRefillQuantity(ObjectId patientId, String prescriptionId, String medicationPrescribedId, RefillQuantity refillQuantity);
	
	public Mono<Void> raiseRefillRequest(RefillRequestsEO refillRequestsEO); 

}
