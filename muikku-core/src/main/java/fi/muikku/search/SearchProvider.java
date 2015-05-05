package fi.muikku.search;

import java.util.List;

public interface SearchProvider {
  
  public String getName();
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types);
  public void init();
  public void deinit();
  
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, String freeText, int start, int maxResults);
}
