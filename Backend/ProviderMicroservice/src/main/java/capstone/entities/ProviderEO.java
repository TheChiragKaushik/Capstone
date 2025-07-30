package capstone.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "providers")
public class ProviderEO {
    private ObjectId _id;
    private String firstName;
    private String lastName;
    private String specialization;
    private Contact contact;
    private Address address;
    private String password;
    private List<PatientRef> patients;
    private String createdAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

    @Data
    public static class Contact {
        private String email;
        private String phone;
    }

    @Data
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    public static class PatientRef { 
        
		private String patientId;
        private Contact contact;
        private String firstName;
        private String lastName;
        private Address address;
        private String gender;
        private String dateOfBirth;
       
    }
}
