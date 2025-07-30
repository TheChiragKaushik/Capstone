package capstone.services.impl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import capstone.entities.PatientEO;
import capstone.entities.PatientEO.Contact;
import capstone.entities.PharmacyEO;
import capstone.entities.ProviderEO;
import capstone.entities.RequestBody.SignUpRequest;
import capstone.services.LoginServices;
import reactor.core.publisher.Mono;


@Service
public class LoginServicesImpl implements LoginServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<PatientEO> signUpPatient(SignUpRequest patient) {
		PatientEO patientEO = new PatientEO();
		patientEO.setFirstName(patient.getFirstName());
		patientEO.setLastName(patient.getLastName());
		patientEO.setPassword(patient.getPassword());
		
		Contact contact = new Contact();
		contact.setEmail(patient.getContact().getEmail());
		contact.setPhone(patient.getContact().getPhone());
		patientEO.setContact(contact);
		
		return reactiveMongoTemplateRef.save(patientEO)
				.doOnSuccess(savedPatient -> System.out.println("Patient signed up successfully: " + savedPatient))
				.doOnError(error -> System.err.println("Error signing up patient: " + error.getMessage()));
	}

	@Override
	public Mono<PatientEO> signInPatient(String email, String password) {
		System.out.println("In function");
		Query query = new Query(Criteria.where("contact.email").is(email)
				.and("password").is(password));
		return reactiveMongoTemplateRef.findOne(query, PatientEO.class).doOnSuccess(
				patient -> System.out.println("Patient signed in successfully: " + patient))
				.doOnError(error -> System.err.println("Error signing in patient: " + error.getMessage()));
	}

	@Override
	public Mono<PatientEO> findPatientByEmail(String email) {
		Query query = new Query(Criteria.where("contact.email").is(email));
		return reactiveMongoTemplateRef.findOne(query, PatientEO.class);
	}

	@Override
	public Mono<PatientEO> findPatientById(String id) {
		ObjectId patientId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(patientId));
		return reactiveMongoTemplateRef.findOne(query, PatientEO.class);
	}

	@Override
	public Mono<ProviderEO> signUpProvider(SignUpRequest signUpRequest) {
		
		ProviderEO providerEO = new ProviderEO();
		providerEO.setFirstName(signUpRequest.getFirstName());
		providerEO.setLastName(signUpRequest.getLastName());
		providerEO.setPassword(signUpRequest.getPassword());
		
		capstone.entities.ProviderEO.Contact contact = new capstone.entities.ProviderEO.Contact();
		contact.setEmail(signUpRequest.getContact().getEmail());
		contact.setPhone(signUpRequest.getContact().getPhone());
		providerEO.setContact(contact);
		
		return reactiveMongoTemplateRef.save(providerEO)
				.doOnSuccess(savedProvider -> System.out.println("Provider signed up successfully: " + savedProvider))
				.doOnError(error -> System.err.println("Error signing up provider: " + error.getMessage()));
	}

	@Override
	public Mono<ProviderEO> signInProvider(String email, String password) {
		Query query = new Query(Criteria.where("contact.email").is(email)
				.and("password").is(password));
		return reactiveMongoTemplateRef.findOne(query, ProviderEO.class);
	}

	@Override
	public Mono<ProviderEO> findProviderByEmail(String email) {
		Query query = new Query(Criteria.where("contact.email").is(email));
		return reactiveMongoTemplateRef.findOne(query, ProviderEO.class);
	}

	@Override
	public Mono<ProviderEO> findProviderById(String id) {
		ObjectId providerId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(providerId));
		return reactiveMongoTemplateRef.findOne(query, ProviderEO.class);
	}

	@Override
	public Mono<PharmacyEO> signUpPharmacy(SignUpRequest pharmacy) {
		PharmacyEO pharmacyEO = new PharmacyEO();
		pharmacyEO.setName(pharmacy.getName());
		pharmacyEO.setPassword(pharmacy.getPassword());
		capstone.entities.PharmacyEO.Contact contact = new capstone.entities.PharmacyEO.Contact();
		contact.setEmail(pharmacy.getContact().getEmail());
		contact.setPhone(pharmacy.getContact().getPhone());
		pharmacyEO.setContact(contact);
		return reactiveMongoTemplateRef.save(pharmacyEO)
				.doOnSuccess(savedPharmacy -> System.out.println("Pharmacy signed up successfully: " + savedPharmacy))
				.doOnError(error -> System.err.println("Error signing up pharmacy: " + error.getMessage()));
	}

	@Override
	public Mono<PharmacyEO> signInPharmacy(String email, String password) {
		Query query = new Query(Criteria.where("contact.email").is(email)
				.and("password").is(password));
		return reactiveMongoTemplateRef.findOne(query, PharmacyEO.class);
	}

	@Override
	public Mono<PharmacyEO> findPharmacyByEmail(String email) {
		Query query = new Query(Criteria.where("contact.email").is(email));
		return reactiveMongoTemplateRef.findOne(query, PharmacyEO.class);
	}

	@Override
	public Mono<PharmacyEO> findPharmacyById(String id) {
		ObjectId pharmacyId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(pharmacyId));
		return reactiveMongoTemplateRef.findOne(query, PharmacyEO.class);
	}

}
