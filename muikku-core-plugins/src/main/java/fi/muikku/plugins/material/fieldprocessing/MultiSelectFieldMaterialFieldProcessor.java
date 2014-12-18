package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryMultiSelectFieldController;
import fi.muikku.plugins.material.fieldmeta.MultiSelectFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.MultiSelectFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryMultiSelectField;
import fi.muikku.plugins.material.model.QueryMultiSelectFieldOption;

public class MultiSelectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryMultiSelectFieldController queryMultiSelectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    MultiSelectFieldMeta multiSelectFieldMeta = objectMapper.readValue(content, MultiSelectFieldMeta.class);
    QueryMultiSelectField queryMultiSelectField = queryMultiSelectFieldController.findQueryMultiSelectFieldByMaterialAndName(material, multiSelectFieldMeta.getName());
    if (queryMultiSelectField == null) {
      queryMultiSelectField = queryMultiSelectFieldController.createQueryMultiSelectField(material, multiSelectFieldMeta.getName());
    }
    
    for (MultiSelectFieldOptionMeta multiSelectFieldOptionMeta : multiSelectFieldMeta.getOptions()) {
      QueryMultiSelectFieldOption queryMultiSelectFieldOption = queryMultiSelectFieldController.findQueryMultiSelectFieldOptionByFieldAndName(queryMultiSelectField, multiSelectFieldOptionMeta.getName());
      if (queryMultiSelectFieldOption == null) {
        queryMultiSelectFieldController.createQueryMultiSelectFieldOption(queryMultiSelectField, multiSelectFieldOptionMeta.getName(), multiSelectFieldOptionMeta.getText());
      } else {
        queryMultiSelectFieldController.updateQueryMultiSelectFieldOptionText(queryMultiSelectFieldOption, multiSelectFieldOptionMeta.getText());
      }
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.multiselect";
  }

}
