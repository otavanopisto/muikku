package fi.otavanopisto.muikku.plugins.workspace;

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
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/workspace-management", to = "/jsf/workspace/workspace-management.jsf")
public class WorkspaceManagementBackingBean extends AbstractWorkspaceBackingBean {

  @Parameter
  private String workspaceUrlName;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
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
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.MANAGE_WORKSPACE, workspaceEntity)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    workspaceEntityId = workspaceEntity.getId();
    workspaceBackingBean.setWorkspaceUrlName(urlName);
    
    return null;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  private Long workspaceEntityId;
}
