package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;

public interface SearchProvider {
  
  public String getName();

  public void init();
  public void deinit();
  
  public WorkspaceSearchBuilder searchWorkspaces();
  public SearchResults<List<IndexedWorkspace>> searchIndexedWorkspaces(List<String> subjects, List<SchoolDataIdentifier> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, List<SchoolDataIdentifier> curriculumIdentifiers, 
      Collection<OrganizationRestriction> organizationRestrictions, String freeText, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser, int start, int maxResults, List<Sort> sorts);
  public SearchResult searchWorkspaces(List<String> subjects, List<SchoolDataIdentifier> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, List<SchoolDataIdentifier> curriculumIdentifiers, 
      Collection<OrganizationRestriction> organizationRestrictions, String freeText, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser, int start, int maxResults, List<Sort> sorts);
  public SearchResult searchWorkspaces(String subject, int courseNumber);
  public SearchResult findWorkspace(SchoolDataIdentifier identifier); 
  
  public CommunicatorMessageSearchBuilder searchCommunicatorMessages();
  public SearchResults<List<IndexedCommunicatorMessage>> searchCommunicatorMessages(String queryString, long senderId, IndexedCommunicatorMessageSender sender, List<IndexedCommunicatorMessageRecipient> recipients, Long searchId, Date created, Set<Long> tags, int start, int maxResults, List<Sort> sorts);

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

  public SearchResult searchUserGroups(String searchTerm, String archetype, List<OrganizationEntity> organizations, int start, int maxResults);
  public long countActiveStudents(OrganizationEntity organizationEntity);
  public long countInactiveStudents(OrganizationEntity organizationEntity);
  
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
