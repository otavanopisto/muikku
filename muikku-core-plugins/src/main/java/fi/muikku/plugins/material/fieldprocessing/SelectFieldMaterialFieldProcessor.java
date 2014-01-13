package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.OptionListField.Option;
import fi.muikku.plugins.materialfields.QuerySelectFieldController;
import fi.muikku.plugins.materialfields.model.QuerySelectField;

public class SelectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QuerySelectFieldController querySelectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    OptionListField optionListField = objectMapper.readValue(content, OptionListField.class);
    QuerySelectField querySelectField = querySelectFieldController.createQuerySelectField(material, optionListField.getName(), Boolean.FALSE);
    for (Option option : optionListField.getOptions()) {
      querySelectFieldController.createSelectFieldOption(querySelectField, option.getName(), option.getText());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.option-list";
  }

}
