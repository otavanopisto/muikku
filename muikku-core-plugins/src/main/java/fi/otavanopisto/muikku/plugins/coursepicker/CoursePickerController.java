package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.Archived;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.OrganizationWorkspaceVisibility;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.EducationType;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.PublicityRestriction;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.TemplateRestriction;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public class CoursePickerController {

  @Inject
  private SessionController sessionController;
  
  @Inject 
  private CourseMetaController courseMetaController;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  public List<Subject> listSubjects() {
    return courseMetaController.listSubjects();
  }

  /**
   * Returns a list curriculums the user should be able to find workspaces under.
   * 
   * @return a list curriculums the user should be able to find workspaces under
   */
  public List<Curriculum> listAvailableCurriculums() {
    Set<SchoolDataIdentifier> availableWorkspaceCurriculums = prepareCoursePickerWorkspaceFilterSearch()
        .listDistinctWorkspaceCurriculums();

    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<Curriculum> curriculums = courseMetaController.listCurriculums();

      if (availableWorkspaceCurriculums != null) {
        curriculums.removeIf(curriculum -> !availableWorkspaceCurriculums.contains(curriculum.getIdentifier()));
      }
      
      return curriculums;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  /**
   * Returns a list education types the user should be able to find workspaces under.
   * 
   * @return a list education types the user should be able to find workspaces under
   */
  public List<EducationType> listAvailableEducationTypes() {
    Set<SchoolDataIdentifier> availableWorkspaceEducationTypes = prepareCoursePickerWorkspaceFilterSearch()
        .listDistinctWorkspaceEducationTypes();
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<EducationType> educationTypes = courseMetaController.listEducationTypes();

      if (availableWorkspaceEducationTypes != null) {
        educationTypes.removeIf(educationType -> !availableWorkspaceEducationTypes.contains(educationType.getIdentifier()));
      }

      return educationTypes;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  /**
   * Lists accessible organizations from Course Pickers' perspective.
   * 
   * In other words, the organizations that may have publicly accessible workspaces or
   * organization that the logged user belongs to.
   * 
   * @return organizations
   */
  public List<OrganizationEntity> listAccessibleOrganizations() {
    List<OrganizationEntity> organizations = organizationEntityController.listByWorkspaceVisibility(OrganizationWorkspaceVisibility.PUBLIC, Archived.UNARCHIVED);
    
    if (sessionController.isLoggedIn()) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
      OrganizationEntity loggedUserOrganization = userSchoolDataIdentifier.getOrganization();
      if (loggedUserOrganization != null) {
        SchoolDataIdentifier loggedUserOrganizationIdentifier = loggedUserOrganization.schoolDataIdentifier();
        
        if (organizations.stream().noneMatch(organization -> loggedUserOrganizationIdentifier.equals((organization.schoolDataIdentifier())))) {
          organizations.add(loggedUserOrganization);
        }
      }
    }
    
    return organizations;
  }
  
  /**
   * Attempts to prepare a WorkspaceSearchBuilder such that it covers all the possible
   * workspaces that the user may find. If the user is logged in, they may have access
   * to workspaces that are otherwise hidden to some users.
   * 
   * Main use of this method is to determine which kind of filter the user should be
   * shown in Course Picker.
   * 
   * @return a WorkspaceSearchBuilder with parameters that should match all the workspaces
   *         the user is able to find one way or another.
   */
  private WorkspaceSearchBuilder prepareCoursePickerWorkspaceFilterSearch() {
    List<WorkspaceAccess> accesses = new ArrayList<>(Arrays.asList(WorkspaceAccess.ANYONE));
    if (sessionController.isLoggedIn()) {
      accesses.add(WorkspaceAccess.LOGGED_IN);
      accesses.add(WorkspaceAccess.MEMBERS_ONLY);
    }

    TemplateRestriction templateRestriction = sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_WORKSPACE_TEMPLATES)
        ? TemplateRestriction.LIST_ALL
        : TemplateRestriction.ONLY_WORKSPACES;

    PublicityRestriction publicityRestriction = sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_ALL_UNPUBLISHED_WORKSPACES) 
        ? PublicityRestriction.LIST_ALL
        : PublicityRestriction.ONLY_PUBLISHED;

    List<OrganizationEntity> organizations = listAccessibleOrganizations();
    List<OrganizationRestriction> organizationRestrictions = organizationEntityController.listUserOrganizationRestrictions(organizations, publicityRestriction, templateRestriction);

    return searchProviders.get().searchWorkspaces()
        .setOrganizationRestrictions(organizationRestrictions)
        .setAccesses(accesses)
        .setAccessUser(sessionController.getLoggedUser());
  }
}
