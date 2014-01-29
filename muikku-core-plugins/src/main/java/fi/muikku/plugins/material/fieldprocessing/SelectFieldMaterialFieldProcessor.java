package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QuerySelectFieldController;
import fi.muikku.plugins.material.fieldmeta.SelectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;

public class SelectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QuerySelectFieldController querySelectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    SelectFieldMeta selectFieldMeta = objectMapper.readValue(content, SelectFieldMeta.class);
    QuerySelectField querySelectField = querySelectFieldController.findQuerySelectFieldByMaterialAndName(material, selectFieldMeta.getName());
    if (querySelectField == null) {
      querySelectField = querySelectFieldController.createQuerySelectField(material, selectFieldMeta.getName());
    }
    
    for (SelectFieldOptionMeta selectFieldOptionMeta : selectFieldMeta.getOptions()) {
      QuerySelectFieldOption querySelectFieldOption = querySelectFieldController.findQuerySelectFieldOptionBySelectFieldAndName(querySelectField, selectFieldOptionMeta.getName());
      if (querySelectFieldOption == null) {
        querySelectFieldController.createQuerySelectFieldOption(querySelectField, selectFieldOptionMeta.getName(), selectFieldOptionMeta.getText());
      } else {
        querySelectFieldController.updateQuerySelectFieldOptionText(querySelectFieldOption, selectFieldOptionMeta.getText());
      }
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }

}
