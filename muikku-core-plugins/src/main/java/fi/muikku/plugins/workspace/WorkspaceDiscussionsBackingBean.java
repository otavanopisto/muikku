package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

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
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public String init() {
    workspaceBackingBean.setWorkspaceUrlName(getWorkspaceUrlName());
    return null;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
}