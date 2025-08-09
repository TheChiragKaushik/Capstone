package capstone.entities;

import java.util.UUID;

import lombok.Data;

@Data
public class DoseReminderNotificationEO {
	
	private String doseReminderNotificationId;
	private String notificationRequestId;
	private Boolean checked;
	private Boolean taken;
	private PatientNotificationsRequestsEO notification;
	
	public DoseReminderNotificationEO() {
        this.doseReminderNotificationId = UUID.randomUUID().toString();
    }

}
