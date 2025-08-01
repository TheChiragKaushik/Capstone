package capstone.entities;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;


@Data
@Document(collection ="alarmringtones")
public class AlarmRingtonesEO {
	
	private ObjectId _id;
	
	private String name;
	private String url;
	
	@JsonProperty("_id")
    public String get_id_asString() {
        return _id != null ? _id.toHexString() : null;
    }

}
