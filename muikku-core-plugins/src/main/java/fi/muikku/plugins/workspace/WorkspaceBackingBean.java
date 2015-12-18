package fi.muikku.plugins.workspace;

import javax.annotation.PostConstruct;
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
  
  @Inject
  private WorkspaceToolSettingsController workspaceToolSettingsController;
  
  @PostConstruct
  public void init() {
    homeVisible = true;
    guidesVisible = true;
    materialsVisible = true;
    discussionsVisible = true;
    usersVisible = true;
    journalVisible = true;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
    
    WorkspaceEntity workspaceEntity = getWorkspaceEntity();
    
    mayManageMaterials = sessionController.hasCoursePermission(MuikkuPermissions.MANAGE_WORKSPACE_MATERIALS, workspaceEntity);
    homeVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "home");
    guidesVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "guides");
    materialsVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "materials");
    discussionsVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "discussions");
    usersVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "users");
    journalVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "journal");
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

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(getWorkspaceEntity(),
        sessionController.getLoggedUser());

    if (workspaceUserEntity != null)
      return workspaceUserEntity.getWorkspaceUserRole().getArchetype().equals(WorkspaceRoleArchetype.STUDENT);
    else
      return false;
  }

  public String getAssessmentState() {
    if (!sessionController.isLoggedIn()) {
      return null;
    }

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(getWorkspaceEntity(),
        sessionController.getLoggedUser());

    if (workspaceUserEntity != null) {
      WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
      return assessmentState.getStateName();
    } else
      return null;
  }

  public Boolean getMayManageMaterials() {
    return mayManageMaterials;
  }

  public boolean getHomeVisible() {
    return homeVisible;
  }

  public boolean isGuidesVisible() {
    return guidesVisible;
  }

  public boolean isMaterialsVisible() {
    return materialsVisible;
  }

  public boolean isDiscussionsVisible() {
    return discussionsVisible;
  }

  public boolean isUsersVisible() {
    return usersVisible;
  }

  public boolean isJournalVisible() {
    return journalVisible;
  }

  private Boolean mayManageMaterials;
  private String workspaceUrlName;
  private boolean homeVisible;
  private boolean guidesVisible;
  private boolean materialsVisible;
  private boolean discussionsVisible;
  private boolean usersVisible;
  private boolean journalVisible;
}
