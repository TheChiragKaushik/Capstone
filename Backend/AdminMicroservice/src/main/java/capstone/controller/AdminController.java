package capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.mongodb.client.result.UpdateResult;

import capstone.entities.AlarmRingtonesEO;
import capstone.entities.AllergyEO;
import capstone.entities.MedicationEO;
import capstone.services.AdminServices;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminServices adminServicesRef;

	@PostMapping("/medications")
	public Mono<MedicationEO> addNewMedication(@RequestBody MedicationEO medicationEO) {
		return adminServicesRef.addNewMedication(medicationEO).onErrorResume(ex -> {
			return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Failed to add new medication: " + ex.getMessage(), ex));
		});
	}

	@PostMapping("/allergies")
	public Mono<AllergyEO> addNewAllergy(@RequestBody AllergyEO allergyEO) {
		return adminServicesRef.addNewAllergy(allergyEO)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to add new allergy: " + ex.getMessage(), ex)));
	}

	@GetMapping("/medications")
	public Mono<?> getMedications(@RequestParam(value = "MedicationId", required = false) String medicationId,
			@RequestParam(required = false) String type) {
		if (medicationId != null && !medicationId.isEmpty()) {
			return adminServicesRef.findMedicationById(medicationId).switchIfEmpty(
					Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Medication not found")));
		} else if (type != null && !type.isEmpty()) {
			return adminServicesRef.findMedicationsByType(type).collectList().flatMap(medications -> {
				if (medications.isEmpty()) {
					return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No medications for this type found"));
				}
				return Mono.just(medications);
			});
		}
		return adminServicesRef.findAllMedications().collectList().flatMap(medications -> {
			if (medications.isEmpty()) {
				return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No medications found"));
			}
			return Mono.just(medications);
		});
	}

	@GetMapping("/allergies")
	public Mono<?> getAllergies(@RequestParam(value = "AllergyId", required = false) String allergyId) {
		if (allergyId != null && !allergyId.isEmpty()) {
			return adminServicesRef.findAllergyById(allergyId).switchIfEmpty(
					Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Medication not found")));
		}
		return adminServicesRef.findAllAllergies().collectList().flatMap(allergies -> {
			if (allergies.isEmpty()) {
				return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No medications found"));
			}
			return Mono.just(allergies);
		});
	}

	@PutMapping("/medications")
	public Mono<UpdateResult> updateMedications(
			@RequestParam(value = "MedicationId", required = true) String medicationId,
			@RequestBody MedicationEO medicationEO) {
		return adminServicesRef.updateMedicationById(medicationId, medicationEO)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to update medication: " + ex.getMessage(), ex)));
	}

	@PutMapping("/allergies")
	public Mono<UpdateResult> updateAllergies(@RequestParam(value = "AllergyId", required = true) String allergyId,
			@RequestBody AllergyEO allergyEO) {
		return adminServicesRef.updateAllergyById(allergyId, allergyEO)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to update allergy: " + ex.getMessage(), ex)));
	}

	@DeleteMapping("/medications")
	public Mono<MedicationEO> deleteMedications(
			@RequestParam(value = "MedicationId", required = true) String medicationId) {
		return adminServicesRef.deleteMedicationById(medicationId)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to update medication: " + ex.getMessage(), ex)));
	}

	@DeleteMapping("/allergies")
	public Mono<AllergyEO> deleteAllergies(@RequestParam(value = "AllergyId", required = true) String allergyId) {
		return adminServicesRef.deleteAllergyById(allergyId)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to update medication: " + ex.getMessage(), ex)));
	}
	
	
	@PostMapping("/ringtones")
	public Mono<AlarmRingtonesEO> addNewMedication(@RequestBody AlarmRingtonesEO alarmRingtonesRef) {
		return adminServicesRef.addNewRingtone(alarmRingtonesRef).onErrorResume(ex -> {
			return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Failed to add new AlarmRingtone: " + ex.getMessage(), ex));
		});
	}
	
	@GetMapping("/ringtones")
	public Mono<?> getRingtones(@RequestParam(value = "RingtoneId", required = false) String ringtoneId) {
		if (ringtoneId != null && !ringtoneId.isEmpty()) {
			return adminServicesRef.findRingtoneById(ringtoneId).switchIfEmpty(
					Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "Ringtone By Id not found")));
		}
		return adminServicesRef.findAllRingtones().collectList().flatMap(ringtones -> {
			if (ringtones.isEmpty()) {
				return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "No Ringtone found"));
			}
			return Mono.just(ringtones);
		});
	}
	
	
	@DeleteMapping("/ringtones")
	public Mono<AlarmRingtonesEO> deleteRingtone(@RequestParam(value = "RingtoneId", required = true) String ringtoneId) {
		return adminServicesRef.deleteRingtoneById(ringtoneId)
				.onErrorResume(ex -> Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
						"Failed to update Ringtone: " + ex.getMessage(), ex)));
	}

}
