package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.materialfields.QueryTextFieldController;

public class TextFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    TextField textField = objectMapper.readValue(content, TextField.class);
    queryTextFieldController.createQueryTextField(material, textField.getName(), Boolean.FALSE);
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.text";
  }

}
