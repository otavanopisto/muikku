package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Arrays;
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

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/help", to = "/jsf/workspace/help.jsf")
public class WorkspaceHelpPageBackingBean extends AbstractWorkspaceBackingBean {

  @Inject
  private Logger logger;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private SessionController sessionController;

  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public String init() {
    String urlName = getWorkspaceUrlName();

    if (StringUtils.isBlank(urlName)) {
      return NavigationRules.NOT_FOUND;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);

    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE_HELP, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    workspaceEntityId = workspaceEntity.getId();
    
    try {
      WorkspaceMaterial helpPage = workspaceMaterialController.ensureWorkspaceHelpPageExists(workspaceEntity);
      contentNodes = Arrays.asList(workspaceMaterialController.createContentNode(helpPage));
    }
    catch (WorkspaceMaterialException e) {
      logger.log(Level.SEVERE, "Error loading materials", e);
      return NavigationRules.INTERNAL_ERROR;
    }

    workspaceBackingBean.setWorkspaceUrlName(urlName);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      workspaceId = workspaceEntity.getId();
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceName = workspace.getName();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    materialsBaseUrl = String.format("/workspace/%s/materials", workspaceUrlName);

    return null;
  }

  public String getMaterialsBaseUrl() {
    return materialsBaseUrl;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
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

  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }

  private Long workspaceId;
  private String workspaceName;
  private long workspaceEntityId;

  private List<ContentNode> contentNodes;
  private String materialsBaseUrl;

}
