package capstone.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.PharmacyEO;
import reactor.core.publisher.Mono;

public interface PharmacyServices {
	
	public Mono<PharmacyEO> addnewPharmacy(PharmacyEO pharmacyEO);
	
	public Mono<PharmacyEO> getPharmacyById(ObjectId pharmacyId);
	
	public Mono<UpdateResult> updatePharmacy(ObjectId pharmacyId, PharmacyEO pharmacyEO);
	
	public Mono<Object> deletePharmacy(ObjectId pharmacyId);
	
}
