package capstone.entities;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import capstone.entities.PatientEO.Prescription.MedicationPrescribed;
import lombok.Data;


@Data
@Document(collection = "patientnotificationsrequests")
public class PatientNotificationsRequestsEO {
	
	@Id
	private ObjectId _id;
	private String patientId;
	private String medicationName;
	private String scheduleId;
	private String period;
	private String instruction;
	private String scheduledTime;
	private String dateToTakeOn;
	private Integer doseTablets;
	private String message;
    private String status;
    private MedicationPrescribed medicationPrescribed;
    	
	@JsonProperty("_id")
	public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}
	
}
