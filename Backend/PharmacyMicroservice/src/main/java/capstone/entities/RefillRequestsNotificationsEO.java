package capstone.entities;

import lombok.Data;

@Data
public class RefillRequestsNotificationsEO {
	
	private String refillRequestNotificationId;
	private Boolean checked;
	private String status;
	private Integer refilledQuantity;
	private RefillRequestsEO refillRequest;
	
	public RefillRequestsNotificationsEO() {
		this.refillRequestNotificationId = java.util.UUID.randomUUID().toString();
	}

}
