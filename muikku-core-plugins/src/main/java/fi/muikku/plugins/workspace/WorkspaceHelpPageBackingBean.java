package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

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
@Join(path = "/workspace/{workspaceUrlName}/help", to = "/workspaces/help.jsf")
public class WorkspaceHelpPageBackingBean {

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
  private WorkspaceBackingBean workspaceBackingBean;

  @Inject
  private WorkspaceVisitController workspaceVisitController;

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
    
    contentNodes = new ArrayList<ContentNode>();
    List<WorkspaceMaterial> helpPages = workspaceMaterialController.findHelpPages(workspaceEntity);
    for (WorkspaceMaterial helpPage : helpPages) {
      ContentNode node = workspaceMaterialController.createContentNode(helpPage);
      contentNodes.add(node);
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
  
  public List<ContentNode> getContentNodes() {
    return contentNodes;
  }

  private Long workspaceId;
  private String workspaceName;
  private long workspaceEntityId;

  private List<ContentNode> contentNodes;

}
