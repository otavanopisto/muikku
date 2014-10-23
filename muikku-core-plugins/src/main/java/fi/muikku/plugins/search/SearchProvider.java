package fi.muikku.plugins.search;

import java.util.Map;

public interface SearchProvider {
  public String getName();
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults);
  public void addOrUpdateIndex(String typeName, Map<String, Object> entity);
  public void deleteFromIndex(String typeName, Long id);
  public void init();
}
