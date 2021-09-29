package fi.otavanopisto.muikku.search;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;

public interface WorkspaceSearchBuilder {

  SearchResult search();
  
  String getSchoolDataSource();

  WorkspaceSearchBuilder setSchoolDataSource(String schoolDataSource);

  List<String> getSubjects();

  WorkspaceSearchBuilder addSubject(String subject);

  WorkspaceSearchBuilder setSubjects(List<String> subjects);

  List<String> getWorkspaceIdentifiers();

  WorkspaceSearchBuilder addWorkspaceIdentifier(String identifier);

  WorkspaceSearchBuilder setWorkspaceIdentifiers(List<String> identifiers);

  List<SchoolDataIdentifier> getEducationTypeIdentifiers();

  WorkspaceSearchBuilder addEducationTypeIdentifier(SchoolDataIdentifier educationTypeIdentifier);

  WorkspaceSearchBuilder setEducationTypeIdentifiers(List<SchoolDataIdentifier> educationTypeIdentifiers);

  List<SchoolDataIdentifier> getCurriculumIdentifiers();

  WorkspaceSearchBuilder addCurriculumIdentifier(SchoolDataIdentifier curriculumIdentifier);

  WorkspaceSearchBuilder setCurriculumIdentifiers(List<SchoolDataIdentifier> curriculumIdentifiers);

  List<SchoolDataIdentifier> getOrganizationIdentifiers();

  WorkspaceSearchBuilder addOrganizationIdentifier(SchoolDataIdentifier organizationIdentifier);

  WorkspaceSearchBuilder setOrganizationIdentifiers(List<SchoolDataIdentifier> organizationIdentifiers);

  String getFreeText();

  WorkspaceSearchBuilder setFreeText(String freeText);

  Set<WorkspaceAccess> getAccesses();

  WorkspaceSearchBuilder addAccess(WorkspaceAccess access);

  WorkspaceSearchBuilder setAccesses(Collection<WorkspaceAccess> accesses);

  SchoolDataIdentifier getAccessUser();

  WorkspaceSearchBuilder setAccessUser(SchoolDataIdentifier accessUser);

  PublicityRestriction getPublicityRestriction();
  WorkspaceSearchBuilder setPublicityRestriction(PublicityRestriction publicityRestriction);

  int getFirstResult();

  WorkspaceSearchBuilder setFirstResult(int firstResult);

  int getMaxResults();

  WorkspaceSearchBuilder setMaxResults(int maxResults);

  List<Sort> getSorts();

  WorkspaceSearchBuilder addSort(Sort sort);

  WorkspaceSearchBuilder setSorts(List<Sort> sorts);

  TemplateRestriction getTemplateRestriction();
  WorkspaceSearchBuilder setTemplateRestriction(TemplateRestriction templateRestriction);

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
  
}