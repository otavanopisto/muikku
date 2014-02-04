package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryChecklistFieldController;
import fi.muikku.plugins.material.fieldmeta.ChecklistFieldOptionMeta;
import fi.muikku.plugins.material.fieldmeta.ChecklistFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistFieldOption;

public class ChecklistFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryChecklistFieldController queryChecklistFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    ChecklistFieldMeta checklistFieldMeta = objectMapper.readValue(content, ChecklistFieldMeta.class);
    QueryChecklistField queryChecklistField = queryChecklistFieldController.findQueryChecklistFieldByMaterialAndName(material, checklistFieldMeta.getName());
    if (queryChecklistField == null) {
      queryChecklistField = queryChecklistFieldController.createQueryChecklistField(material, checklistFieldMeta.getName());
    }
    
    for (ChecklistFieldOptionMeta checklistFieldOptionMeta : checklistFieldMeta.getOptions()) {
      QueryChecklistFieldOption queryChecklistFieldOption = queryChecklistFieldController.findQueryChecklistFieldOptionByFieldAndName(queryChecklistField, checklistFieldOptionMeta.getName());
      if (queryChecklistFieldOption == null) {
        queryChecklistFieldController.createQueryChecklistFieldOption(queryChecklistField, checklistFieldOptionMeta.getName(), checklistFieldOptionMeta.getText());
      } else {
        queryChecklistFieldController.updateQueryChecklistFieldOptionText(queryChecklistFieldOption, checklistFieldOptionMeta.getText());
      }
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.checklist";
  }

}
