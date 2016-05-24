package fi.otavanopisto.muikku.plugins.workspace;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

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
    workspaceEntityId = null;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  @Deprecated
  public Long getWorkspaceId() {
    return workspaceEntityId;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public WorkspaceEntity getWorkspaceEntity() {
    if (getWorkspaceEntityId() == null) {
      return null;
    }
    
    return workspaceController.findWorkspaceEntityById(getWorkspaceEntityId());
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    WorkspaceEntity workspaceEntity = resolveWorkspaceEntity(workspaceUrlName);
    if (workspaceEntity != null) {
      this.workspaceEntityId = workspaceEntity.getId();
      this.workspaceUrlName = workspaceEntity.getUrlName();
    }
    
    homeVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "home");
    guidesVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "guides");
    materialsVisible = workspaceToolSettingsController.getToolVisible(workspaceEntity, "materials");
    discussionsVisible = sessionController.hasWorkspacePermission(ForumResourcePermissionCollection.FORUM_ACCESSWORKSPACEFORUMS, workspaceEntity) && workspaceToolSettingsController.getToolVisible(workspaceEntity, "discussions");
    usersVisible = sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_MEMBERS, workspaceEntity) && workspaceToolSettingsController.getToolVisible(workspaceEntity, "users");
    journalVisible = sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_JOURNAL, workspaceEntity) && workspaceToolSettingsController.getToolVisible(workspaceEntity, "journal");
  }

  private WorkspaceEntity resolveWorkspaceEntity(String workspaceUrlName) {
    if (StringUtils.isBlank(workspaceUrlName)) {
      return null;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
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

  private Long workspaceEntityId;
  private String workspaceUrlName;
  private boolean homeVisible;
  private boolean guidesVisible;
  private boolean materialsVisible;
  private boolean discussionsVisible;
  private boolean usersVisible;
  private boolean journalVisible;
}
