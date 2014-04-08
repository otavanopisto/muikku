package fi.muikku.plugins.search;

import java.io.IOException;
import java.util.Map;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;

public interface SearchProvider {
  public Object search(String[] types, Map Query);
  public void addToIndex(Object entity) throws JsonGenerationException, JsonMappingException, IOException;
  public void deleteFromIndex(Object entity) throws JsonGenerationException, JsonMappingException, IOException;
}
