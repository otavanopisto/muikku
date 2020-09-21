package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder.TemplateRestrictionForCommunicatorMessage;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;

public interface SearchProvider {
  
  public String getName();
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types);
  public SearchResult freeTextSearch(String text, int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults);
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types);
  public void init();
  public void deinit();
  
  public WorkspaceSearchBuilder searchWorkspaces();
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, List<SchoolDataIdentifier> curriculumIdentifiers, List<SchoolDataIdentifier> organizationIdentifiers, String freeText, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser, boolean includeUnpublished, TemplateRestriction templateRestriction, int start, int maxResults, List<Sort> sorts);
  public SearchResult searchWorkspaces(String schoolDataSource, String subject, int courseNumber);
  public SearchResult findWorkspace(SchoolDataIdentifier identifier);
  
  public CommunicatorMessageSearchBuilder searchCommunicatorMessages();
  public SearchResult searchCommunicatorMessages(String message, long sender, List<CommunicatorMessageRecipient> receiver, TemplateRestrictionForCommunicatorMessage templateRestrictionForCommunicatorMessage, int start, int maxResults, List<Sort> sorts);

  public SearchResult findUser(SchoolDataIdentifier identifier, boolean includeInactive);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden, 
      Boolean onlyDefaultUsers, int start, int maxResults);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden,
      Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden, 
      Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, 
      Date startedStudiesBefore);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults, 
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore,
      Date studyTimeEndsBefore);
  
  SearchResult searchUserGroups(String searchTerm, List<OrganizationEntity> organizations, int start, int maxResults);
  
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
