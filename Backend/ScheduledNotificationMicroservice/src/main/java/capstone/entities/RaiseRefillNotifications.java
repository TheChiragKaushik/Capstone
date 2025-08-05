package capstone.entities;

import java.util.UUID;

import capstone.entities.Constants.RaiseRefillEO;
import lombok.Data;

@Data
public class RaiseRefillNotifications {
	
	private String raiseRefillNotificationId;
	private Boolean checked;
	private RaiseRefillEO raiseRefill;
	
	public RaiseRefillNotifications() {
        this.raiseRefillNotificationId = UUID.randomUUID().toString();
    }

}
