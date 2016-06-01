package fi.otavanopisto.muikku.plugins.announcer;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceBackingBean;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/announcer", to = "/jsf/workspace/workspace_announcer.jsf")
public class WorkspaceAnnouncerBackingBean {

  @Parameter
  private String workspaceUrlName;
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private NavigationController navigationController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;
  
  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController
        .findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }

    if (!workspaceEntity.getPublished()) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
        return NavigationRules.NOT_FOUND;
      }
    }

    if (workspaceEntity.getAccess() != WorkspaceAccess.ANYONE) {
      if (!sessionController.hasWorkspacePermission(AnnouncerPermissions.WORKSPACE_ANNOUNCER_TOOL, workspaceEntity)) {
        if (!sessionController.isLoggedIn()) {
          return navigationController.requireLogin();
        } else {
          return NavigationRules.ACCESS_DENIED;
        }
      }
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.log(Level.SEVERE, String.format("Could not find workspace for workspace entity (%d)", workspaceEntity.getId()));
        return NavigationRules.NOT_FOUND;
      }
      
      workspaceName = workspace.getName();
      workspaceNameExtension = workspace.getNameExtension();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
      
    workspaceEntityId = workspaceEntity.getId();

    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }
  
  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }
  
  public void setWorkspaceNameExtension(String workspaceNameExtension) {
    this.workspaceNameExtension = workspaceNameExtension;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  private String workspaceName;
  private String workspaceNameExtension;
  private Long workspaceEntityId;

}
