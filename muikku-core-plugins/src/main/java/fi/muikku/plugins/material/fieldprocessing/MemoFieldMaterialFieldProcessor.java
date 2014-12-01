package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryMemoFieldController;
import fi.muikku.plugins.material.fieldmeta.MemoFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryMemoField;

public class MemoFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryMemoFieldController queryMemoFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    MemoFieldMeta memoFieldMeta = objectMapper.readValue(content, MemoFieldMeta.class);
    
    QueryMemoField queryMemoField = queryMemoFieldController.findQueryMemoFieldByMaterialAndName(material, memoFieldMeta.getName());
    if (queryMemoField == null) {
      queryMemoFieldController.createQueryMemoField(material, memoFieldMeta.getName());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.memo";
  }

}
