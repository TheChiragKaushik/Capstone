package capstone.services;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.RaiseRefillEO;
import reactor.core.publisher.Mono;

public interface PharmacyPatientRequestRefillService {

	public Mono<UpdateResult> approveRefillRequest(RaiseRefillEO raiseRefillEO);

}
