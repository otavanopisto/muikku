package fi.muikku.plugins.workspace;

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
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join(path = "/workspace/{workspaceUrlName}/users", to = "/jsf/workspace/users.jsf")
public class WorkspaceUsersBackingBean {

  @Inject
  private SessionController sessionController;

  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

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
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.LIST_WORKSPACE_MEMBERS, workspaceEntity)) {
      return NavigationRules.NOT_FOUND;
    }

    return null;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  private Long workspaceEntityId;

}
