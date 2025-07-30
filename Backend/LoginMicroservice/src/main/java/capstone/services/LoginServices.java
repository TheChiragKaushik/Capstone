package capstone.services;

import capstone.entities.PatientEO;
import capstone.entities.PharmacyEO;
import capstone.entities.ProviderEO;
import capstone.entities.RequestBody.SignUpRequest;
import reactor.core.publisher.Mono;

public interface LoginServices {
	
	public Mono<PatientEO> signUpPatient(SignUpRequest signUpRequest);
	
	public Mono<PatientEO> signInPatient(String email, String password);
	
	public Mono<PatientEO> findPatientByEmail(String email);
	
	public Mono<PatientEO> findPatientById(String id);
	
	public Mono<ProviderEO> signUpProvider(SignUpRequest signUpRequest);
	
	public Mono<ProviderEO> signInProvider(String email, String password);
	
	public Mono<ProviderEO> findProviderByEmail(String email);
	
	public Mono<ProviderEO> findProviderById(String id);
	
	public Mono<PharmacyEO> signUpPharmacy(SignUpRequest signUpRequest);
	
	public Mono<PharmacyEO> signInPharmacy(String email, String password);
	
	public Mono<PharmacyEO> findPharmacyByEmail(String email);
	
	public Mono<PharmacyEO> findPharmacyById(String id);

}
