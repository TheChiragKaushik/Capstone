package capstone.entities;

import java.util.UUID;

import capstone.entities.PharmacyEO.PharmacyInventory;
import lombok.Data;

@Data
public class InventoryRestockReminderNotificationsEO {
	
	private String inventoryRestockReminderNotificationId;
	private PharmacyInventory pharmacyInventory;
	private Boolean checked;
	private String status;
	private Integer restockedQuantity; 
	
	public InventoryRestockReminderNotificationsEO() {
		this.inventoryRestockReminderNotificationId = UUID.randomUUID().toString();
	}

}
