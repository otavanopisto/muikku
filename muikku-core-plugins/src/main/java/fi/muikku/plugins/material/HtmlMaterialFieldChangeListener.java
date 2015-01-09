package fi.muikku.plugins.material;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.events.HtmlMaterialFieldCreated;
import fi.muikku.plugins.material.events.HtmlMaterialFieldDeleted;
import fi.muikku.plugins.material.fieldmeta.TextFieldMeta;
import fi.muikku.plugins.material.model.HtmlMaterial;
import fi.muikku.plugins.material.model.QueryField;

public class HtmlMaterialFieldChangeListener {
  
  @Inject
  private Logger logger;

  @Inject
  private QueryFieldController queryFieldController;

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  public void onHtmlMaterialTextFieldCreated(@Observes HtmlMaterialFieldCreated event) {
    if (event.getField().getType().equals("application/vnd.muikku.field.text")) {
      ObjectMapper objectMapper = new ObjectMapper();
      TextFieldMeta textFieldMeta;
      try {
        textFieldMeta = objectMapper.readValue(event.getField().getContent(), TextFieldMeta.class);
      } catch (IOException e) {
        // TODO: Abort publishing
        logger.log(Level.SEVERE, "Could not parse text field meta", e);
        return;
      }
      
      QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(event.getMaterial(), textFieldMeta.getName());
      if (queryField == null) {
        queryTextFieldController.createQueryTextField(event.getMaterial(), textFieldMeta.getName());
      } else {
        // TODO: Abort publishing
        logger.log(Level.SEVERE, "An field with same name already exists");
        return;
      }
    }
  }
  
  public void onHtmlMaterialFieldDeleted(@Observes HtmlMaterialFieldDeleted event) {
    HtmlMaterial material = event.getMaterial();
    QueryField queryField = queryFieldController.findQueryFieldByMaterialAndName(material, event.getField().getName());
    if (queryField != null) {
      queryFieldController.deleteQueryField(queryField);
    }
  }
  
}
