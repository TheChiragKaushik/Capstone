package capstone.services;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.RaiseRefillEO;
import reactor.core.publisher.Mono;

public interface PatientPharmacyRefillService {

	public Mono<UpdateResult> patientRaiseRefillRequestNotificationToPharmacy(RaiseRefillEO raiseRefillEO);

}
