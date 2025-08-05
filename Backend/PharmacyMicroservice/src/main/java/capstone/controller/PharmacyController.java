package capstone.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.PharmacyEO;
import capstone.entities.PharmacyEO.PharmacyInventory;
import capstone.services.PharmacyServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/pharmacy")
public class PharmacyController {

	@Autowired
	private PharmacyServices pharmacyServicesRef;

	@PutMapping("/{pharmacyId}")
	public Mono<UpdateResult> updatePharmacy(@PathVariable String pharmacyId, @RequestBody PharmacyEO pharmacyEO) {
		return Mono.fromCallable(() -> new ObjectId(pharmacyId))
				.flatMap(id -> pharmacyServicesRef.updatePharmacy(id, pharmacyEO))
				.onErrorResume(IllegalArgumentException.class, e -> {
					return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pharmacyId format"));
				}).onErrorResume(e -> {
					return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
							"An error occurred while updating the pharmacy"));
				});
	}

	@GetMapping("/{pharmacyId}")
	public Mono<PharmacyEO> getPharmacy(@PathVariable String pharmacyId) {
		return Mono.fromCallable(() -> new ObjectId(pharmacyId)).flatMap(id -> pharmacyServicesRef.getPharmacyById(id))
				.switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Pharmacy not found")))
				.onErrorResume(IllegalArgumentException.class, e -> {
					return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pharmacyId format"));
				}).onErrorResume(e -> {
					return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
							"An unexpected error occurred"));
				});
	}

	@PutMapping("/inventory/{pharmacyId}")
	public Mono<UpdateResult> updatePharmacyInventory(
	        @PathVariable String pharmacyId,
	        @RequestParam(value = "InventoryId", required = false) String inventoryId,
	        @RequestBody PharmacyInventory pharmacyInventory
	) {
		
	    if (inventoryId != null && !inventoryId.isEmpty()) {
	        return Mono.fromCallable(() -> pharmacyId)
	                .flatMap(id -> pharmacyServicesRef.updatePharmacyInventory(id, inventoryId, pharmacyInventory))
	                .onErrorResume(IllegalArgumentException.class, e -> {
	                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pharmacyId or inventoryId format"));
	                }).onErrorResume(e -> {
	                    return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
	                            "An error occurred while updating the pharmacy inventory"));
	                });
	    } else {
	        return Mono.fromCallable(() -> pharmacyId)
	                .flatMap(id -> pharmacyServicesRef.addInventoryToPharmacy(id, pharmacyInventory))
	                .onErrorResume(IllegalArgumentException.class, e -> {
	                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pharmacyId format"));
	                }).onErrorResume(e -> {
	                    return Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
	                            "An error occurred while adding to the pharmacy inventory"));
	                });
	    }
	}
	
	
	@GetMapping("/medication")
	public Flux<PharmacyEO> getAllPharmacyProvidingCertainMedication(@RequestParam(value = "MedicationId", required = true) String medicationId) {
	    
	    return pharmacyServicesRef.getAllPharmacyProvidingCertainMedication(medicationId)
	            .hasElements()
	            .flatMapMany(hasElements -> {
	                if (hasElements) {
	                    return pharmacyServicesRef.getAllPharmacyProvidingCertainMedication(medicationId);
	                } else {
	                    return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Pharmacy not found for medication: " + medicationId));
	                }
	            })
	            .onErrorResume(IllegalArgumentException.class, e -> 
	                Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid medicationId format: " + medicationId))
	            )
	            .onErrorResume(e -> 
	                Mono.error(new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred"))
	            );
	}

}
