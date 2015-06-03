package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

@Named
@Stateful
@RequestScoped
public class WorkspaceBackingBean {

  @Inject
  private WorkspaceController workspaceController;
  
  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
 
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
    this.mayManageMaterials = sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, getWorkspaceEntity());
  }
  
  public Long getWorkspaceId() {
    return getWorkspaceEntity().getId();
  }

  private WorkspaceEntity getWorkspaceEntity() {
    String urlName = getWorkspaceUrlName();
    if (StringUtils.isBlank(urlName)) {
      return null;
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return null;
    }
    
    return workspaceEntity;
  }

  public String getAssessmentState() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return WorkspaceAssessmentState.UNASSESSED.getStateName();
    }
    WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(getWorkspaceEntity(), userEntity);
    return assessmentState.getStateName();
  }
  
  public Boolean getMayManageMaterials() {
    return mayManageMaterials;
  }
  
  private Boolean mayManageMaterials;
  private String workspaceUrlName;
}
