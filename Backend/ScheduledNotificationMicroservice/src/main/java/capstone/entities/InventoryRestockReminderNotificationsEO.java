package capstone.entities;

import java.util.UUID;

import lombok.Data;

@Data
public class InventoryRestockReminderNotificationsEO {
	
	private String inventoryRestockReminderNotificationId;
	private Boolean checked;
	private String medicationName;
	private String medicationId;
	private String inventoryId;
	private String message;
	
	public InventoryRestockReminderNotificationsEO() {
		this.inventoryRestockReminderNotificationId = UUID.randomUUID().toString();
	}

}
