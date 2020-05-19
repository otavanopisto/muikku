package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.base.Archived;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.OrganizationWorkspaceVisibility;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
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

  public List<Subject> listSubjects() {
    return courseMetaController.listSubjects();
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
  
}
