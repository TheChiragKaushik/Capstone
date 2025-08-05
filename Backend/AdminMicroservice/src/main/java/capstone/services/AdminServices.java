package capstone.services;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.AlarmRingtonesEO;
import capstone.entities.AllergyEO;
import capstone.entities.MedicationEO;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AdminServices {

	public Mono<MedicationEO> addNewMedication(MedicationEO medication);

	public Mono<MedicationEO> findMedicationById(String id);

	public Mono<MedicationEO> deleteMedicationById(String id);

	public Mono<UpdateResult> updateMedicationById(String id, MedicationEO medication);
	
	public Flux<MedicationEO> findAllMedications();

	public Mono<AllergyEO> addNewAllergy(AllergyEO allergy);

	public Mono<AllergyEO> findAllergyById(String id);

	public Mono<AllergyEO> deleteAllergyById(String id);

	public Mono<UpdateResult> updateAllergyById(String id, AllergyEO medication);

	public Flux<AllergyEO> findAllAllergies();

	public Flux<MedicationEO> findMedicationsByType(String type);

	public Mono<AlarmRingtonesEO> addNewRingtone(AlarmRingtonesEO alarmRingtonesEORef);

	public Flux<AlarmRingtonesEO> findAllRingtones();

	public Mono<AlarmRingtonesEO> deleteRingtoneById(String id);

	public Mono<UpdateResult> updateRingtoneById(String id, AlarmRingtonesEO alarmRingtone);

	public Mono<AlarmRingtonesEO> findRingtoneById(String id);

}
