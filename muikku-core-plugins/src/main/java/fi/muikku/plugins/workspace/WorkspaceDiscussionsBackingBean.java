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
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/discussions", to = "/jsf/workspace/discussions.jsf")
@LoggedIn
public class WorkspaceDiscussionsBackingBean {
  
  @Parameter
  private String workspaceUrlName;

  @Inject
  private WorkspaceController workspaceController;

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

    workspaceBackingBean.setWorkspaceUrlName(urlName);
    workspaceEntityId = workspaceEntity.getId();
    
    return null;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  private Long workspaceEntityId;
}