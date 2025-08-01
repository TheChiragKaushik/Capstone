package capstone.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;


@Data
@Document(collection = "pharmacynotifications")
public class PharmacyNotificationsEO {
	
	private ObjectId _id;
	private String pharmacyId;
	
	private Integer totalRefillRequests;
	private Integer totalRefillRequestsChecked;
//	private List<RefillRequestsNotificationsEO> refillRequestsNotifications;
	
	private Integer totalPharmacyInventoryRestockReminderNotifications;
	private Integer totalPharmacyInventoryRestockReminderNotificationsChecked;
	private List<InventoryRestockReminderNotificationsEO> inventoryRestockReminderNotifications;

}
