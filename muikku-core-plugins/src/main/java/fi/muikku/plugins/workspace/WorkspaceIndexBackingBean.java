package fi.muikku.plugins.workspace;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.event.ComponentSystemEvent;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
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
  private WorkspaceVisitController workspaceVisitController;
  
  @Inject
  private Logger logger;

  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

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

    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);

    workspaceId = workspaceEntity.getId();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();

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

  public void visit() {
    workspaceVisitController.incrementVisits(getWorkspaceEntity());
  }
  
  public Long getNumVisits() {
    return workspaceVisitController.getNumVisits(getWorkspaceEntity());
  }

  private Long workspaceId;
  private String workspaceName;
}
