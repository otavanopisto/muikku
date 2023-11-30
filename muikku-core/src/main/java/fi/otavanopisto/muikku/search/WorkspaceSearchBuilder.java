package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;

public interface WorkspaceSearchBuilder {

  SearchResult search();

  SearchResults<List<IndexedWorkspace>> searchTyped();
  
  /**
   * List distinct curriculums from indexed workspaces.
   * 
   * @return a list of distinct curriculums from workspaces
   */
  Set<SchoolDataIdentifier> listDistinctWorkspaceCurriculums();

  /**
   * List distinct education types from indexed workspaces.
   * 
   * @return a list of distinct education types from workspaces
   */
  Set<SchoolDataIdentifier> listDistinctWorkspaceEducationTypes();
  
  List<SchoolDataIdentifier> getSubjects();

  WorkspaceSearchBuilder addSubject(SchoolDataIdentifier subject);

  WorkspaceSearchBuilder setSubjects(List<SchoolDataIdentifier> subjects);

  List<SchoolDataIdentifier> getWorkspaceIdentifiers();

  WorkspaceSearchBuilder addWorkspaceIdentifier(SchoolDataIdentifier identifier);

  WorkspaceSearchBuilder setWorkspaceIdentifiers(List<SchoolDataIdentifier> identifiers);

  List<SchoolDataIdentifier> getEducationTypeIdentifiers();

  WorkspaceSearchBuilder addEducationTypeIdentifier(SchoolDataIdentifier educationTypeIdentifier);

  WorkspaceSearchBuilder setEducationTypeIdentifiers(List<SchoolDataIdentifier> educationTypeIdentifiers);

  List<SchoolDataIdentifier> getCurriculumIdentifiers();

  WorkspaceSearchBuilder addCurriculumIdentifier(SchoolDataIdentifier curriculumIdentifier);

  WorkspaceSearchBuilder setCurriculumIdentifiers(List<SchoolDataIdentifier> curriculumIdentifiers);

  String getFreeText();

  WorkspaceSearchBuilder setFreeText(String freeText);

  Set<WorkspaceAccess> getAccesses();

  WorkspaceSearchBuilder addAccess(WorkspaceAccess access);

  WorkspaceSearchBuilder setAccesses(Collection<WorkspaceAccess> accesses);

  SchoolDataIdentifier getAccessUser();

  WorkspaceSearchBuilder setAccessUser(SchoolDataIdentifier accessUser);

  int getFirstResult();

  WorkspaceSearchBuilder setFirstResult(int firstResult);

  int getMaxResults();

  WorkspaceSearchBuilder setMaxResults(int maxResults);

  List<Sort> getSorts();

  WorkspaceSearchBuilder addSort(Sort sort);

  WorkspaceSearchBuilder setSorts(List<Sort> sorts);

  public enum PublicityRestriction {
    LIST_ALL,
    ONLY_PUBLISHED,
    ONLY_UNPUBLISHED
  }

  public enum TemplateRestriction {
    LIST_ALL,
    ONLY_TEMPLATES,
    ONLY_WORKSPACES
  }
  
  public static class OrganizationRestriction {
    
    public OrganizationRestriction(SchoolDataIdentifier organizationIdentifier, PublicityRestriction publicityRestriction, TemplateRestriction templateRestriction) {
      this.organizationIdentifier = organizationIdentifier;
      this.publicityRestriction = publicityRestriction;
      this.templateRestriction = templateRestriction;
    }
    
    public SchoolDataIdentifier getOrganizationIdentifier() {
      return organizationIdentifier;
    }
    
    public PublicityRestriction getPublicityRestriction() {
      return publicityRestriction;
    }
    
    public TemplateRestriction getTemplateRestriction() {
      return templateRestriction;
    }

    private final SchoolDataIdentifier organizationIdentifier;
    private final PublicityRestriction publicityRestriction;
    private final TemplateRestriction templateRestriction;
  }

  WorkspaceSearchBuilder addOrganizationRestriction(OrganizationRestriction organizationRestriction);
  WorkspaceSearchBuilder setOrganizationRestrictions(List<OrganizationRestriction> organizationRestrictions);
  List<OrganizationRestriction> getOrganizationRestrictions();

}