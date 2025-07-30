package capstone.services.impl;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.PharmacyEO;
import capstone.services.PharmacyServices;
import reactor.core.publisher.Mono;

public class PharmacyServicesImpl implements PharmacyServices {
	
	@Autowired
	private ReactiveMongoTemplate reactiveMongoTemplateRef;
	
	
	@Override
	public Mono<PharmacyEO> addnewPharmacy(PharmacyEO pharmacyEO) {
		return reactiveMongoTemplateRef.save(pharmacyEO); 
	}

	@Override
	public Mono<PharmacyEO> getPharmacyById(ObjectId pharmacyId) {
		Query query = new Query(Criteria.where("_id").is(pharmacyId));
		return reactiveMongoTemplateRef.findOne(query, PharmacyEO.class)
				.switchIfEmpty(Mono.error(new RuntimeException("Pharmacy not found with id: " + pharmacyId)));
	}

	@Override
	public Mono<UpdateResult> updatePharmacy(ObjectId pharmacyId, PharmacyEO pharmacyEO) {
		Query query = new Query(Criteria.where("_id").is(pharmacyId));
		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(pharmacyEO, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set(key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);
		
		return reactiveMongoTemplateRef.getCollection("pharmacies").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<Object> deletePharmacy(ObjectId pharmacyId) {
		Query query = new Query(Criteria.where("_id").is(pharmacyId));
		return reactiveMongoTemplateRef.remove(query, PharmacyEO.class)
				.then(Mono.empty())
				.switchIfEmpty(Mono.error(new RuntimeException("Pharmacy not found with id: " + pharmacyId)));
	}

}
