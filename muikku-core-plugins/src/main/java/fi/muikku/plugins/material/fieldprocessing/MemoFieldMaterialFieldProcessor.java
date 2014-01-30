package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryTextFieldController;
import fi.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryTextField;

public class MemoFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryTextFieldController queryTextFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    MemoFieldMeta memoFieldMeta = objectMapper.readValue(content, MemoFieldMeta.class);
    
    QueryTextField queryTextField = queryTextFieldController.findQueryTextFieldByMaterialAndName(material, memoFieldMeta.getName());
    if (queryTextField == null) {
      queryTextFieldController.createQueryTextField(material, memoFieldMeta.getName());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

}
