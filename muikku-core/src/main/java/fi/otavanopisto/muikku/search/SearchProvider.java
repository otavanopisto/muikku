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
  public SearchResults<List<IndexedWorkspace>> searchIndexedWorkspaces(List<SchoolDataIdentifier> subjects, List<SchoolDataIdentifier> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions, String freeText, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser, int start, int maxResults, List<Sort> sorts);

  public SearchResult searchWorkspaces(List<SchoolDataIdentifier> subjects, List<SchoolDataIdentifier> identifiers, List<SchoolDataIdentifier> educationTypeIdentifiers, List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions, String freeText, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser, int start, int maxResults, List<Sort> sorts);

  public SearchResult searchWorkspaces(SchoolDataIdentifier subjectIdentifier, int courseNumber);

  public SearchResult searchWorkspacesSignupEnd();
  
  /**
   * List distinct curriculums from indexed workspaces.
   * 
   * @return a list of distinct curriculums from workspaces
   */
  Set<SchoolDataIdentifier> listDistinctWorkspaceCurriculums(Collection<OrganizationRestriction> organizationRestrictions, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser);

  /**
   * List distinct education types from indexed workspaces.
   * 
   * @return a list of distinct education types from workspaces
   */
  Set<SchoolDataIdentifier> listDistinctWorkspaceEducationTypes(Collection<OrganizationRestriction> organizationRestrictions, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser);

  public SearchResult findWorkspace(SchoolDataIdentifier identifier);
  public IndexedCommunicatorMessage findCommunicatorMessage(Long communicatorMessageId);
  public CommunicatorMessageSearchBuilder searchCommunicatorMessages();
  public SearchResults<List<IndexedCommunicatorMessage>> searchCommunicatorMessages(String queryString, long senderId, IndexedCommunicatorMessageSender sender, List<IndexedCommunicatorMessageRecipient> recipients, Date created, Set<Long> tags, int start, int maxResults, List<Sort> sorts);

  public SearchResult findUser(SchoolDataIdentifier identifier, boolean includeInactive);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden,
      Boolean onlyDefaultUsers, int start, int maxResults, boolean joinGroupsAndWorkspaces);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden,
      Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields, boolean joinGroupsAndWorkspaces);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, Collection<Long> groups,
      Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers, Boolean includeInactiveStudents, Boolean includeHidden,
      Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers,
      Date startedStudiesBefore, boolean joinGroupsAndWorkspaces);
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults,
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore,
      Date studyTimeEndsBefore, boolean joinGroupsAndWorkspaces);

  public SearchResult findUserGroup(SchoolDataIdentifier identifier);
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