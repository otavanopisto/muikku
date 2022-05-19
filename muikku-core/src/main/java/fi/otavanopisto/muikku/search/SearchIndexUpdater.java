package fi.otavanopisto.muikku.search;

import java.util.Map;

public interface SearchIndexUpdater {
  
  public String getName();
  public void addOrUpdateIndex(String indexName, String typeName, Map<String, Object> entity);
  public void deleteFromIndex(String indexName, String typeName, String id);
  public void init();
  public void deinit();
  
}
