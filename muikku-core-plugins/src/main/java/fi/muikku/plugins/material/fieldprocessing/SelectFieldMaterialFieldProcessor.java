package fi.muikku.plugins.material.fieldprocessing;

import java.io.IOException;

import javax.inject.Inject;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.plugins.material.MaterialFieldProcessor;
import fi.muikku.plugins.material.QuerySelectFieldController;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta;
import fi.muikku.plugins.material.fieldmeta.SelectFieldMeta.Option;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QuerySelectField;

public class SelectFieldMaterialFieldProcessor implements MaterialFieldProcessor {

  @Inject
  private QuerySelectFieldController querySelectFieldController;
  
  @Override
  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper();
    
    SelectFieldMeta selectFieldMeta = objectMapper.readValue(content, SelectFieldMeta.class);
    QuerySelectField querySelectField = querySelectFieldController.createQuerySelectField(material, selectFieldMeta.getName(), Boolean.FALSE);
    for (Option option : selectFieldMeta.getOptions()) {
      querySelectFieldController.createSelectFieldOption(querySelectField, option.getName(), option.getText());
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.select";
  }

}
