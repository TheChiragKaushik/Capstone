package capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.entities.PatientEO;
import capstone.entities.PharmacyEO;
import capstone.entities.ProviderEO;
import capstone.entities.RequestBody.LoginRequest;
import capstone.services.LoginServices;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/logon")
public class LoginController {

	@Autowired
	private LoginServices loginServicesRef;
	
	@GetMapping
	public Mono<?> getUser(
			@RequestParam(value="PatientId", required = false) String patientId,
			@RequestParam(value="ProviderId", required = false) String providerId,
			@RequestParam(value="PharmacyId", required = false) String pharmacyId
			){
		if(patientId != null) {
			return loginServicesRef.findPatientById(patientId);
		} else if (providerId != null) {
			return loginServicesRef.findProviderById(providerId);
		} else if (pharmacyId != null) {
			return loginServicesRef.findPharmacyById(pharmacyId);
		} else {
			return Mono.error(new IllegalArgumentException("No valid ID provided"));
		}
	}

	@PostMapping("/signup")
	public Mono<?> signUpUser(Object user) {
		if (user instanceof PatientEO) {
			return loginServicesRef.signUpPatient((PatientEO) user);
		} else if (user instanceof ProviderEO) {
			return loginServicesRef.signUpProvider((ProviderEO) user);
		} else if (user instanceof PharmacyEO) {
			return loginServicesRef.signUpPharmacy((PharmacyEO) user);
		} else {
			return Mono.error(new IllegalArgumentException("Invalid user type"));
		}
	}

	@PostMapping("/login")
	public Mono<?> signInUser(@RequestBody LoginRequest loginRequest) {
		String email = loginRequest.getEmail();
		String password = loginRequest.getPassword();
		if (email.contains("@capstone.com")) {
			return loginServicesRef.signInPatient(email, password);
		} else if (email.contains("@capstone.care")) {
			return loginServicesRef.signInProvider(email, password);
		} else if (email.contains("@capstone.med")) {
			return loginServicesRef.signInPharmacy(email, password);
		} else {
			return Mono.error(new IllegalArgumentException("Invalid user type"));
		}
	}
}
