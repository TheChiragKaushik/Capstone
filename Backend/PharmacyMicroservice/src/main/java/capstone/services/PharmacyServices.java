package capstone.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.PharmacyEO;
import capstone.entities.PharmacyEO.PharmacyInventory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PharmacyServices {
	
	public Mono<PharmacyEO> addnewPharmacy(PharmacyEO pharmacyEO);
	
	public Mono<PharmacyEO> getPharmacyById(ObjectId pharmacyId);
	
	public Mono<UpdateResult> updatePharmacy(ObjectId pharmacyId, PharmacyEO pharmacyEO);
	
	public Mono<Object> deletePharmacy(ObjectId pharmacyId);

	public Mono<UpdateResult> addInventoryToPharmacy(String pharmacyId, PharmacyInventory pharmacyInventory);

	public Mono<UpdateResult> updatePharmacyInventory(String pharmacyId, String inventoryId,
			PharmacyInventory pharmacyInventory);

	public Flux<PharmacyEO> getAllPharmacyProvidingCertainMedication(String medicationId);
	
}
