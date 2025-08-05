package capstone.services.impl;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.AlarmRingtonesEO;
import capstone.entities.AllergyEO;
import capstone.entities.MedicationEO;
import capstone.services.AdminServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


@Service
public class AdminServicesImpl implements AdminServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;

	@Override
	public Mono<MedicationEO> addNewMedication(MedicationEO medication) {
		return reactiveMongoTemplateRef.save(medication);
	}

	@Override
	public Mono<MedicationEO> findMedicationById(String id) {
		ObjectId medicationId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(medicationId));
		
		return reactiveMongoTemplateRef.findOne(query, MedicationEO.class);
	}
	
	@Override
	public Flux<MedicationEO> findMedicationsByType(String type){
		Query query = new Query(Criteria.where("type").is(type));
		return reactiveMongoTemplateRef.find(query, MedicationEO.class);
	}

	@Override
	public Mono<MedicationEO> deleteMedicationById(String id) {
	    ObjectId medicationId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(medicationId));
	    return reactiveMongoTemplateRef.findAndRemove(query, MedicationEO.class);
	}

	@Override
	public Mono<UpdateResult> updateMedicationById(String id, MedicationEO medication) {
		ObjectId medicationId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(medicationId));
	    
	    Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(medication, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("medications").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
		
	}

	@Override
	public Mono<AllergyEO> addNewAllergy(AllergyEO allergy) {
		return reactiveMongoTemplateRef.save(allergy);
	}

	@Override
	public Mono<AllergyEO> findAllergyById(String id) {
		ObjectId allergyId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(allergyId));
		
		return reactiveMongoTemplateRef.findOne(query, AllergyEO.class);
	}

	@Override
	public Mono<AllergyEO> deleteAllergyById(String id) {
		ObjectId allergyId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(allergyId));
	    return reactiveMongoTemplateRef.findAndRemove(query, AllergyEO.class);
	}

	@Override
	public Mono<UpdateResult> updateAllergyById(String id, AllergyEO allergy) {
		ObjectId allergyId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(allergyId));
	    
	    Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(allergy, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("allergies").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Flux<MedicationEO> findAllMedications() {
		// TODO Auto-generated method stub
		return reactiveMongoTemplateRef.findAll(MedicationEO.class);
	}

	@Override
	public Flux<AllergyEO> findAllAllergies() {
		// TODO Auto-generated method stub
		return reactiveMongoTemplateRef.findAll(AllergyEO.class);
	}
	
	@Override
	public Mono<AlarmRingtonesEO> addNewRingtone(AlarmRingtonesEO alarmRingtonesEORef){
		return reactiveMongoTemplateRef.save(alarmRingtonesEORef);
	}
	
	@Override
	public Mono<AlarmRingtonesEO> findRingtoneById(String id) {
		ObjectId alarmaRingtoneId = new ObjectId(id);
		Query query = new Query(Criteria.where("_id").is(alarmaRingtoneId));
		
		return reactiveMongoTemplateRef.findOne(query, AlarmRingtonesEO.class);
	}
	
	@Override
	public Flux<AlarmRingtonesEO> findAllRingtones(){
		return reactiveMongoTemplateRef.findAll(AlarmRingtonesEO.class);
	}
	
	@Override
	public Mono<AlarmRingtonesEO> deleteRingtoneById(String id) {
		ObjectId alarmaRingtoneId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(alarmaRingtoneId));
	    return reactiveMongoTemplateRef.findAndRemove(query, AlarmRingtonesEO.class);
	}

	@Override
	public Mono<UpdateResult> updateRingtoneById(String id, AlarmRingtonesEO alarmRingtone) {
		ObjectId alarmaRingtoneId = new ObjectId(id);
	    Query query = new Query(Criteria.where("_id").is(alarmaRingtoneId));
	    
	    Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(alarmRingtone, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("alarmringtones").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

}
