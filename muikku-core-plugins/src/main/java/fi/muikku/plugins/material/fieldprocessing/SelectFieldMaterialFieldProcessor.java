package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QuerySelectFieldController;
import fi.muikku.plugins.material.fieldmeta.SelectField;
import fi.muikku.plugins.material.fieldmeta.SelectField.Option;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QuerySelectField;

public class SelectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QuerySelectFieldController querySelectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    SelectField selectField = objectMapper.readValue(content, SelectField.class);
    QuerySelectField querySelectField = querySelectFieldController.createQuerySelectField(material, selectField.getName(), Boolean.FALSE);
    for (Option option : selectField.getOptions()) {
      querySelectFieldController.createSelectFieldOption(querySelectField, option.getName(), option.getText());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }

}
