package capstone.services;

import org.bson.types.ObjectId;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.PatientRef;
import capstone.entities.PatientEO.Prescription;
import capstone.entities.ProviderEO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProviderServices {
	
	public Mono<ProviderEO> addNewProvider(ProviderEO provider);
	
	public Mono<ProviderEO> getProviderById(ObjectId providerId);
	
	public Mono<UpdateResult> updateProviderById(ObjectId providerId, ProviderEO providerEO);
	
	public Mono<UpdateResult> updateProviderContact(ObjectId providerId, Contact contact);
	
	public Mono<UpdateResult> updateProviderAddress(ObjectId providerId, Address address);
	
	public Mono<Void> deleteProviderById(ObjectId providerId);
	
	public Mono<ProviderEO> getProviderByEmail(String email);
	
	public Mono<PatientRef> addPatientToProvider(ObjectId providerId, PatientRef patientRef);
	
	public Mono<Void> removePatientFromProvider(ObjectId providerId, String patientId);
	
	public Flux<PatientRef> getPatientsByProviderId(ObjectId providerId);
	
	public Mono<PatientRef> getPatientById(ObjectId providerId, String patientId);
	
	public Mono<Prescription> addPrescriptionToPatient(ObjectId patientId, Prescription prescription);
	
	public Mono<UpdateResult> modifyPrescriptionToPatient(ObjectId patientId , String prescriptionId, Prescription prescription);
	
	public Flux<Prescription> getPatientPrescriptionsByProvider(ObjectId patientId, String providerId);

	Mono<UpdateResult> updatePatientDetailsInProvider(ObjectId providerId, String patientId,
			PatientRef updatedPatientRef);

}
