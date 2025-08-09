package capstone.entities;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

import lombok.Data;

@Data
@Document(collection = "patientnotifications")
public class PatientNotificationsEO {

	
	@Id
	private ObjectId _id;
	private String patientId;
	private Integer totalDoseReminderNotifications;
	private Integer totalDoseReminderNotificationsChecked;
    private List<DoseReminderNotificationEO> doseReminderNotifications;
    private Integer totalRefillApprovedNotifications;
    private Integer totalRefillApprovedCheckedNotifications;
    private List<RefillApprovedNotifications> refillApprovedNotifications;
    
    private Integer totalRaiseRefillNotifications;
    private Integer totalRaiseRefillCheckedNotifications;
    private List<RaiseRefillNotifications> raiseRefillNotifications;
    
    @JsonProperty("_id")
    public String get_id_asString() {
        return _id != null ? _id.toHexString() : null;
    }

}
