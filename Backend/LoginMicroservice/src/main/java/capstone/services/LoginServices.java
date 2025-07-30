package capstone.services;

import capstone.entities.PatientEO;
import capstone.entities.PharmacyEO;
import capstone.entities.ProviderEO;
import reactor.core.publisher.Mono;

public interface LoginServices {
	
	public Mono<PatientEO> signUpPatient(PatientEO patient);
	
	public Mono<PatientEO> signInPatient(String email, String password);
	
	public Mono<PatientEO> findPatientByEmail(String email);
	
	public Mono<PatientEO> findPatientById(String id);
	
	public Mono<ProviderEO> signUpProvider(ProviderEO ProviderEO);
	
	public Mono<ProviderEO> signInProvider(String email, String password);
	
	public Mono<ProviderEO> findProviderByEmail(String email);
	
	public Mono<ProviderEO> findProviderById(String id);
	
	public Mono<PharmacyEO> signUpPharmacy(PharmacyEO pharmacy);
	
	public Mono<PharmacyEO> signInPharmacy(String email, String password);
	
	public Mono<PharmacyEO> findPharmacyByEmail(String email);
	
	public Mono<PharmacyEO> findPharmacyById(String id);

}
