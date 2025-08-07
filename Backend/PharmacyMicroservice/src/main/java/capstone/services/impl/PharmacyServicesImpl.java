package capstone.services.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;

import capstone.entities.PharmacyEO;
import capstone.entities.Constants.PharmacySoundPreference;
import capstone.entities.PharmacyEO.PharmacyInventory;
import capstone.services.PharmacyServices;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
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
		return reactiveMongoTemplateRef.remove(query, PharmacyEO.class).then(Mono.empty())
				.switchIfEmpty(Mono.error(new RuntimeException("Pharmacy not found with id: " + pharmacyId)));
	}

	@Override
	public Mono<UpdateResult> addInventoryToPharmacy(String pharmacyId, PharmacyInventory pharmacyInventory) {
		ObjectId id = new ObjectId(pharmacyId);
		Query query = new Query(Criteria.where("_id").is(id));

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(pharmacyInventory, Map.class);

		Map<String, Object> newInventoryItem = new HashMap<>();

		map.forEach((key, value) -> {
			if (value != null) {
				newInventoryItem.put(key, value);
			}
		});

		Update update = new Update();

		update.push("pharmacyInventory").value(newInventoryItem);

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("pharmacies").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Mono<UpdateResult> updatePharmacyInventory(String pharmacyId, String inventoryId,
			PharmacyInventory pharmacyInventory) {
		ObjectId id = new ObjectId(pharmacyId);
		Query query = new Query(Criteria.where("_id").is(id));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(pharmacyInventory, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("inventoryId")) {
				update.set("pharmacyInventory.$[pharmInv]." + key, value);
			}
		});

		List<Bson> arrayFilters = Arrays.asList(Filters.eq("pharmInv.inventoryId", inventoryId));

		UpdateOptions options = new UpdateOptions().arrayFilters(arrayFilters).upsert(false);
		return reactiveMongoTemplateRef.getCollection("pharmacies").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}

	@Override
	public Flux<PharmacyEO> getAllPharmacyProvidingCertainMedication(String medicationId) {
		Query query = new Query(Criteria.where("pharmacyInventory.medicationId").is(medicationId));

		return reactiveMongoTemplateRef.find(query, PharmacyEO.class);
	}
	
	
	@Override
	public Mono<UpdateResult> updateNotificationSoundsById(ObjectId pharmacyId, PharmacySoundPreference soundPreference) {
		Query query = new Query(Criteria.where("_id").is(pharmacyId));

		Update update = new Update();

		@SuppressWarnings("unchecked")
		Map<String, Object> map = new ObjectMapper().convertValue(soundPreference, Map.class);
		map.forEach((key, value) -> {

			if (value != null && !key.equals("_id")) {
				update.set("soundPreference." + key, value);
			}
		});

		UpdateOptions options = new UpdateOptions().upsert(false);

		return reactiveMongoTemplateRef.getCollection("pharmacies").flatMap(collection -> Mono
				.from(collection.updateOne(query.getQueryObject(), update.getUpdateObject(), options)));
	}


}
