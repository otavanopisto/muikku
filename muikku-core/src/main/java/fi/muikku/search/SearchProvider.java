package fi.muikku.search;

import java.util.Collection;
import java.util.List;

import fi.muikku.model.users.EnvironmentRoleArchetype;

public interface SearchProvider {
  
  public String getName();
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types);
  public void init();
  public void deinit();
  
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, String freeText, boolean includeUnpublished, int start, int maxResults);
  public SearchResult searchWorkspaces(String searchTerm, int start, int maxResults);
  
  SearchResult searchUsers(String text, String[] textFields, EnvironmentRoleArchetype archetype, Collection<Long> groups, Collection<Long> workspaces, int start, int maxResults);
}
