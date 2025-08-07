package capstone.entities;

import java.util.UUID;

import capstone.entities.Constants.RaiseRefillEO;
import lombok.Data;

@Data
public class RefillApprovedNotifications {
	
	private String refillApproveNotificationId;
	private Boolean checked;
	private RaiseRefillEO approvedRefill;
	public RefillApprovedNotifications() {
        this.refillApproveNotificationId = UUID.randomUUID().toString();
    }

}
