package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.List;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface SearchProvider {
  
  public String getName();
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types);
  public void init();
  public void deinit();
  
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, String freeText, boolean includeUnpublished, int start, int maxResults);
  
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, String freeText, boolean includeUnpublished, int start, int maxResults, List<Sort> sorts);
  
  public SearchResult searchWorkspaces(String searchTerm, int start, int maxResults);
  
  public SearchResult searchUsers(String text, String[] textFields, EnvironmentRoleArchetype archetype, Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, int start, int maxResults);
  
  public SearchResult searchUsers(String text, String[] textFields, EnvironmentRoleArchetype archetype, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, int start,
      int maxResults);

  public class Sort {
    
    public Sort(String field, Order order) {
      this.field = field;
      this.order = order;
    }
    
    public String getField() {
      return field;
    }
    
    public Order getOrder() {
      return order;
    }
    
    private String field;
    private Order order;
    
    public enum Order {
      ASC,
      DESC 
    }
  }

  
}
