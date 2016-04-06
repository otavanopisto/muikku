package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;
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

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/materials", to = "/jsf/workspace/materials.jsf")
public class WorkspaceMaterialsBackingBean extends AbstractWorkspaceBackingBean {
  
  @Inject
  private Logger logger;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private NavigationController navigationController;

  @Inject
  private WorkspaceVisitController workspaceVisitController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

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
      if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_UNPUBLISHED_WORKSPACE, workspaceEntity)) {
        return NavigationRules.NOT_FOUND;
      }
    }

    if (workspaceEntity.getAccess() != WorkspaceAccess.ANYONE) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_WORKSPACE_MATERIALS, workspaceEntity)) {
        if (!sessionController.isLoggedIn()) {
          return navigationController.requireLogin();
        } else {
          return NavigationRules.ACCESS_DENIED;
        }
      }
    }
    
    rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);

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
    
    try {
      contentNodes = workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, false);
    }
    catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }
    
    materialsBaseUrl = String.format("/workspace/%s/materials", workspaceUrlName);
    canSignUp = sessionController.hasCoursePermission(MuikkuPermissions.WORKSPACE_SIGNUP, workspaceEntity);
    workspaceVisitController.visit(workspaceEntity);
    
    return null;
  }

  public WorkspaceRootFolder getRootFolder() {
    return rootFolder;
  }

  public void setRootFolder(WorkspaceRootFolder rootFolder) {
    this.rootFolder = rootFolder;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }
  
  public Long getMaxFileSize() {
    return systemSettingsController.getUploadFileSizeLimit();
  }
  
  public String getMaterialsBaseUrl() {
    return materialsBaseUrl;
  }
  
  public Boolean getCanSignUp() {
    return canSignUp;
  }

  private WorkspaceRootFolder rootFolder;
  private List<ContentNode> contentNodes;
  private String workspaceName;
  private String workspaceNameExtension;
  private Long workspaceEntityId;
  private String materialsBaseUrl;
  private Boolean canSignUp;
}
