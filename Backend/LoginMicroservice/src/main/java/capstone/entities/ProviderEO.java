package capstone.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import capstone.entities.Constants.Address;
import capstone.entities.Constants.Contact;
import capstone.entities.Constants.PatientRef;
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
    private List<String> patientIds;
    private List<PatientRef> patients;
    private String createdAt;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

}
