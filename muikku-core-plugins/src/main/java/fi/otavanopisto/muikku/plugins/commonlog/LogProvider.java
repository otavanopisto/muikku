package fi.otavanopisto.muikku.plugins.commonlog;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public interface LogProvider {

  public void log(String collection, Object data);
  public ArrayList<HashMap<String, Object>> getLogEntries(String collection, Map<String, Object> query, int count);
  public ArrayList<HashMap<String, Object>> getLogEntriesOn(String collection, Map<String, Object> query, Date from, Date to);
  public String getName();
  
}
