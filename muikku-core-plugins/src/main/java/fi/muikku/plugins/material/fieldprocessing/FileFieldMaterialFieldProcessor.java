package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QueryFileFieldController;
import fi.muikku.plugins.material.fieldmeta.FileFieldMeta;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryFileField;

public class FileFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QueryFileFieldController queryFileFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    FileFieldMeta fileFieldMeta = objectMapper.readValue(content, FileFieldMeta.class);
    
    QueryFileField queryFileField = queryFileFieldController.findQueryFileFieldByMaterialAndName(material, fileFieldMeta.getName());
    if (queryFileField == null) {
      queryFileFieldController.createQueryFileField(material, fileFieldMeta.getName());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.file";
  }

}
