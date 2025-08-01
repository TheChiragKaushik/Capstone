package capstone.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.ProviderEO;
import capstone.entities.ProviderEO.PatientRef;
import capstone.services.ProviderServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {
	
	@Autowired
	private ProviderServices providerServices;
	
	@PostMapping
	public Mono<ProviderEO> signUpProvider(@RequestBody ProviderEO providerEO) {
		return providerServices.addNewProvider(providerEO);
	}

	@PutMapping("/{providerId}")
	public Mono<UpdateResult> updateProviderDetails(@PathVariable String providerId, @RequestBody ProviderEO providerEO) {
		ObjectId id = new ObjectId(providerId);
		return providerServices.updateProviderById(id, providerEO);
	}
	
	@PutMapping("/{providerId}/contactdetails")
	public Mono<UpdateResult> updateProviderContactDetails(@PathVariable String providerId, @RequestBody Contact contactEO) {
		ObjectId id = new ObjectId(providerId);
		return providerServices.updateProviderContact(id, contactEO);
	}
	
	@PutMapping("/{providerId}/addressdetails")
	public Mono<UpdateResult> updateProviderAddressDetails(@PathVariable String providerId, @RequestBody Address addressEO) {
		ObjectId id = new ObjectId(providerId);
		return providerServices.updateProviderAddress(id, addressEO);
	}
	
	@DeleteMapping("/{providerId}")
	public Mono<Void> deleteProvider(@PathVariable String providerId) {
		ObjectId id = new ObjectId(providerId);
		return providerServices.deleteProviderById(id);
	}
	
	@PutMapping("/{providerId}/patients")
	public Mono<?> modifyPatientToProvider(@PathVariable String providerId,
			@RequestParam(value = "PatientId", required = false) String patientId,
			@RequestBody PatientRef patientRef) {
		ObjectId id = new ObjectId(providerId);
		if(patientId != null) {
			return providerServices.updatePatientDetailsInProvider(id, patientId, patientRef);
		}
		return providerServices.addPatientToProvider(id, patientRef);
	}
	
	@PutMapping("/priscriptions/{patientId}")
	public Mono<?> updatePatientPrescriptions(
			@PathVariable String patientId, 
			@RequestParam(value = "Modify", required = false) Boolean modify,
			@RequestParam(value = "PrescriptionId", required = false) String prescriptionId,
			@RequestBody Prescription prescription) {
		ObjectId id = new ObjectId(patientId);
		if(modify != null && modify) {
			return providerServices.modifyPrescriptionToPatient(id, prescriptionId, prescription);
		}
		return providerServices.addPrescriptionToPatient(id, prescription);
	}
	
	
	@GetMapping("/priscriptions/{patientId}")
	public Flux<Prescription> getPatientPrescriptionsByProvider(
			@PathVariable ObjectId patientId, 
			@RequestParam(value = "ProviderId", required = false) String providerId){
		return providerServices.getPatientPrescriptionsByProvider(patientId, providerId);
	}
	
}
