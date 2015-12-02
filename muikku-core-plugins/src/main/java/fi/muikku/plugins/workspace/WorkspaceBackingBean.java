package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.WorkspaceUserEntityController;

@Named
@Stateful
@RequestScoped
public class WorkspaceBackingBean {

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
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

  public Boolean isStudent() {
    if (!sessionController.isLoggedIn()) {
      return false;
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
        getWorkspaceEntity(), sessionController.getLoggedUser());
    
    if (workspaceUserEntity != null)
      return workspaceUserEntity.getWorkspaceUserRole().getArchetype().equals(WorkspaceRoleArchetype.STUDENT);
    else
      return false;
  }
  
  public String getAssessmentState() {
    if (!sessionController.isLoggedIn()) {
      return null;
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(getWorkspaceEntity(), sessionController.getLoggedUser());
    
    if (workspaceUserEntity != null) {
      WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
      return assessmentState.getStateName();
    } else
      return null;
  }
  
  public Boolean getMayManageMaterials() {
    return mayManageMaterials;
  }
  
  private Boolean mayManageMaterials;
  private String workspaceUrlName;
}
