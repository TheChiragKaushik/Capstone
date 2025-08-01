package capstone.entities;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
@Document(collection = "allergies")
public class AllergyEO {
	
	private ObjectId _id;
	private String name;
    private String type;
    private String description;
    private List<String> sideEffects;
    
    @JsonProperty("_id")
    public String get_id_asString() {
		return _id != null ? _id.toHexString() : null;
	}

}
