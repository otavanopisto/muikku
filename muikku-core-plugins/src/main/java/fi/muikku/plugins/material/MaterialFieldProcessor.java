package fi.muikku.plugins.material;

import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import fi.muikku.plugins.material.model.Material;

public interface MaterialFieldProcessor {

  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException;
  public String getType();
  
}
