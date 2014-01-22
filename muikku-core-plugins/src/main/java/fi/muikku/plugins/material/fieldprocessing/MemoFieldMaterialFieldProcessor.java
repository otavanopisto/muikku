package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryTextFieldController;
import fi.muikku.plugins.material.fieldmeta.MemoField;
import fi.muikku.plugins.material.model.Material;

public class MemoFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    MemoField memoField = objectMapper.readValue(content, MemoField.class);
    queryTextFieldController.createQueryTextField(material, memoField.getName(), Boolean.FALSE);
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

}
