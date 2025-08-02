package capstone.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(collection = "medications")
public class MedicationEO {

    @Id
    private ObjectId _id;
    private String name;
	private String description;
	private Integer oneTablet;
	private String unitMeasure;
	private Integer volumePerDose;
	private String liquidUnitMeasure;
	private String type;

    @JsonProperty("_id")
    public String get_id_asString() {
        return _id != null ? _id.toHexString() : null;
    }
}
