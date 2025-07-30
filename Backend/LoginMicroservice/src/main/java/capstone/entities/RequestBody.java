package capstone.entities;

import capstone.entities.PatientEO.Contact;
import lombok.Data;

@Data
public class RequestBody {
	
	@Data
	public static class LoginRequest {
	    private String email;
	    private String password;
	}
	
	@Data
	public static class SignUpRequest {
		private String firstName;
		private String lastName;
		private String name;
		private Contact contact;
		private String password;
	}
	
	

}
