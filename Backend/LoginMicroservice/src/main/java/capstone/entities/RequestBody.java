package capstone.entities;

import lombok.Data;

@Data
public class RequestBody {
	
	@Data
	public static class LoginRequest {
	    private String email;
	    private String password;
	}
	
	

}
