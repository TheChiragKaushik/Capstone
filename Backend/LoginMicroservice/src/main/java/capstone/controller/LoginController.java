package capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.entities.RequestBody.LoginRequest;
import capstone.entities.RequestBody.SignUpRequest;
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
	
	@GetMapping("/email")
	public Mono<?> getUserByEmail(
			@RequestParam(value="PatientEmail", required = false) String patientEmail,
			@RequestParam(value="ProviderEmail", required = false) String providerEmail,
			@RequestParam(value="PharmacyEmail", required = false) String pharmacyEmail
			){
		if(patientEmail != null) {
			return loginServicesRef.findPatientByEmail(patientEmail);
		} else if (providerEmail != null) {
			return loginServicesRef.findProviderByEmail(providerEmail);
		} else if (pharmacyEmail != null) {
			return loginServicesRef.findPharmacyByEmail(pharmacyEmail);
		} else {
			return Mono.error(new IllegalArgumentException("No valid Email provided"));
		}
	}

	@PostMapping("/signup")
	public Mono<?> signUpUser(@RequestBody SignUpRequest signUpRequest) {
		String email = signUpRequest.getContact().getEmail();
		if (email.contains("@capstone.com")) {
			return loginServicesRef.signUpPatient(signUpRequest);
		} else if (email.contains("@capstone.care")) {
			return loginServicesRef.signUpProvider(signUpRequest);
		} else if (email.contains("@capstone.med")) {
			return loginServicesRef.signUpPharmacy(signUpRequest);
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
