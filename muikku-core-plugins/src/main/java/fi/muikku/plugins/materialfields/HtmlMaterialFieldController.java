package fi.muikku.plugins.materialfields;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.model.field.OptionListField;
import fi.muikku.plugins.material.model.field.TextField;
import fi.muikku.plugins.materialfields.dao.QueryTextFieldDAO;

@RequestScoped
public class HtmlMaterialFieldController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private QueryTextFieldDAO queryTextFieldDAO;
  
  public void decodeQueryFieldFromJson(String contentType, String jsonData) {
    try {
      switch (contentType) {
        case "application/vnd.muikku.field.option-list": {
          OptionListField optionListField = objectMapper.readValue(jsonData, OptionListField.class);
          logger.log(Level.INFO, optionListField.toString());
          break;
        }
        case "application/vnd.muikku.field.text": {
          TextField textField = objectMapper.readValue(jsonData, TextField.class);
          queryTextFieldDAO.create(textField.getName(), "", "", false, "");
          logger.log(Level.INFO, textField.toString());
          break;
        }
      }
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }
  
  private ObjectMapper objectMapper = new ObjectMapper();

}
