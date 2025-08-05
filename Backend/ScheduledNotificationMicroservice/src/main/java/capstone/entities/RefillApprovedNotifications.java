package capstone.entities;

import java.util.UUID;

import capstone.entities.Constants.Refill;
import lombok.Data;

@Data
public class RefillApprovedNotifications {
	
	private String refillApproveNotificationId;
	private Boolean checked;
	private Refill refill;
	public RefillApprovedNotifications() {
        this.refillApproveNotificationId = UUID.randomUUID().toString();
    }

}
