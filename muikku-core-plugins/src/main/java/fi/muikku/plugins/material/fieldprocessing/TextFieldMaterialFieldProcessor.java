package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryTextFieldController;
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryTextField;

public class TextFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    TextFieldMeta textFieldMeta = objectMapper.readValue(content, TextFieldMeta.class);
    
    QueryTextField queryTextField = queryTextFieldController.findQueryTextFieldByMaterialAndName(material, textFieldMeta.getName());
    if (queryTextField == null) {
      queryTextFieldController.createQueryTextField(material, textFieldMeta.getName());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.text";
  }

}
