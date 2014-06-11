package fi.muikku.plugins.commonlog;

import java.util.List;
import java.util.Map;

public interface LogProvider {

  public void log(String collection, Object data);
  public List<Object> getLogEntries(String collection, Map<String, Object> query, int count);
  public String getName();
  
}
