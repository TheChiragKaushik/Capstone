package capstone.services.impl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import capstone.entities.PatientEO;
import capstone.entities.PharmacyEO;
import capstone.entities.ProviderEO;
import capstone.services.LoginServices;
import reactor.core.publisher.Mono;


@Service
public class LoginServicesImpl implements LoginServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<PatientEO> signUpPatient(PatientEO patient) {
		return reactiveMongoTemplateRef.save(patient)
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
	public Mono<ProviderEO> signUpProvider(ProviderEO ProviderEO) {
		return reactiveMongoTemplateRef.save(ProviderEO)
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
	public Mono<PharmacyEO> signUpPharmacy(PharmacyEO pharmacy) {
		return reactiveMongoTemplateRef.save(pharmacy)
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
