package fi.muikku.plugins.workspace;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}", to = "/workspaces/workspace.jsf")
public class WorkspaceIndexBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

  @Inject
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private Logger logger;

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
    workspaceEntityId = workspaceEntity.getId();
    
    WorkspaceMaterial frontPage = workspaceMaterialController.findFrontPage(workspaceEntity);
    if (frontPage != null) {
      workspaceMaterialId = frontPage.getId();
      materialId = frontPage.getMaterialId();
      materialType = "html";
      materialTitle = "Etusivu";
    }

    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);

    schoolDataBridgeSessionController.startSystemSession();
    try {
      workspaceId = workspaceEntity.getId();
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceName = workspace.getName();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }

    return null;
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

  private WorkspaceEntity getWorkspaceEntity() {
    return workspaceController.findWorkspaceEntityById(workspaceId);
  }

  public String getWorkspaceName() {
    return workspaceName;
  }
  public String getContents() {
    return contents;
  }

  public long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(long materialId) {
    this.materialId = materialId;
  }

  public String getMaterialType() {
    return materialType;
  }

  public void setMaterialType(String materialType) {
    this.materialType = materialType;
  }

  public String getMaterialTitle() {
    return materialTitle;
  }

  public void setMaterialTitle(String materialTitle) {
    this.materialTitle = materialTitle;
  }

  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public void visit() {
    workspaceVisitController.visit(getWorkspaceEntity());
  }
  
  public Long getNumVisits() {
    return workspaceVisitController.getNumVisits(getWorkspaceEntity());
  }
  
  private Long workspaceId;
  private String workspaceName;
  private String contents;

  private long workspaceMaterialId;
  private long materialId;
  private long workspaceEntityId;
  private String materialType;
  private String materialTitle;

}
