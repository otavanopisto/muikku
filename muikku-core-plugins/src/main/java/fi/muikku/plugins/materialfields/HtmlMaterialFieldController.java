package fi.muikku.plugins.materialfields;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;

@Dependent
public class HtmlMaterialFieldController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private QueryTextFieldDAO queryTextFieldDAO;
  
  public void decodeQueryFieldFromJson(Material material, String contentType, String jsonData) 
      throws JsonParseException, JsonMappingException, IOException {
      switch (contentType) {
        case "application/vnd.muikku.field.option-list": {
          OptionListField optionListField = objectMapper.readValue(jsonData, OptionListField.class);
          logger.log(Level.INFO, optionListField.toString());
          break;
        }
        case "application/vnd.muikku.field.text": {
          TextField textField = objectMapper.readValue(jsonData, TextField.class);
          queryTextFieldDAO.create(material, textField.getName(), Boolean.FALSE, "");
          logger.log(Level.INFO, textField.toString());
          break;
        }
      }
  }
  
  private ObjectMapper objectMapper = new ObjectMapper();

}
