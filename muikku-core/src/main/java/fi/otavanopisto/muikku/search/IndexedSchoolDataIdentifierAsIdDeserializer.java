package fi.otavanopisto.muikku.search;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

/**
 * Deserializes a string into a SchoolDataIdentifier by using SchoolDataIdentifier.fromId method.
 * I.e. a string that follows the format DATASOURCE-IDENTIFIER. 
 */
public class IndexedSchoolDataIdentifierAsIdDeserializer extends StdDeserializer<SchoolDataIdentifier> {

  private static final long serialVersionUID = -6160777079571085058L;

  public IndexedSchoolDataIdentifierAsIdDeserializer() {
    this(null);
  }
  
  public IndexedSchoolDataIdentifierAsIdDeserializer(Class<?> cls) {
    super(cls);
  }
  
  @Override
  public SchoolDataIdentifier deserialize(JsonParser jp, DeserializationContext dctx)
      throws IOException, JsonProcessingException {
    String value = jp.getValueAsString();
    return StringUtils.isNotBlank(value) ? SchoolDataIdentifier.fromId(value) : null;
  }

}
