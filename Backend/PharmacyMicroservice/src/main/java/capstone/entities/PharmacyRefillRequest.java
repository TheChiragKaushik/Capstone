package capstone.entities;

import java.util.UUID;

import capstone.entities.Constants.RaiseRefillEO;
import lombok.Data;

@Data
public class PharmacyRefillRequest {
	
	private String pharmacyRefillRequestId;
	
	private Boolean checked;
	
	private RaiseRefillEO refillRequest;
	
	public PharmacyRefillRequest() {
		this.pharmacyRefillRequestId = UUID.randomUUID().toString();
	}

}
