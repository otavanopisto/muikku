package fi.otavanopisto.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspaceAnnouncer", to = "/jsf/announcer/workspace_announcer.jsf")
public class WorkspaceAnnouncerBackingBean {

  @Parameter ("workspaceEntityId")
  @Matches ("[0-9]{1,}")
  private Long workspaceEntityId;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @RequestAction
  public String init() {
    
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    if (userEntity == null) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    if (!sessionController.hasCoursePermission(AnnouncerPermissions.WORKSPACE_ANNOUNCER_TOOL, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    
    workspaceName = workspace.getName();
    if (workspace.getNameExtension() != null) {
      workspaceName += " (" + workspace.getNameExtension() + ")";
    }

    return null;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }
  
  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  private String workspaceName;

}
