package fi.muikku.plugins.workspace;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.controller.SystemSettingsController;
import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/materials", to = "/jsf/workspace/materials.jsf")
public class WorkspaceMaterialsBackingBean {

  @Inject
  private Logger logger;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private HttpServletRequest httpServletRequest;

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

  @RequestAction
  public String init() throws UnsupportedEncodingException {
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

    if (!sessionController.hasCoursePermission(MuikkuPermissions.ACCESS_WORKSPACE_MATERIALS, workspaceEntity)) {
      if (!sessionController.isLoggedIn()) {
        String redirectUrl = (String) httpServletRequest.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        if (redirectUrl == null) {
          redirectUrl = httpServletRequest.getRequestURL().toString();
        }
        
        return "/login.jsf?faces-redirect=true&redirectUrl=" + URLEncoder.encode(redirectUrl, "UTF-8");
      } else {
        return NavigationRules.ACCESS_DENIED;
      }
    }
    
    rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      logger.log(Level.SEVERE, String.format("Could not find workspace for workspace entity (%d)", workspaceEntity.getId()));
      return NavigationRules.NOT_FOUND;
    }
    
    workspaceName = workspace.getName();
    workspaceEntityId = workspaceEntity.getId();

    try {
      contentNodes = workspaceMaterialController.listWorkspaceMaterialsAsContentNodes(workspaceEntity, false);
    }
    catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }
      
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

  private WorkspaceRootFolder rootFolder;
  private List<ContentNode> contentNodes;
  private String workspaceName;
  private Long workspaceEntityId;

}
