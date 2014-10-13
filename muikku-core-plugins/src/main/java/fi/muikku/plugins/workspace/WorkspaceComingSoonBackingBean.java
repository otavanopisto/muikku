package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/comingsoon", to = "/workspaces/comingsoon.jsf")
public class WorkspaceComingSoonBackingBean {
  
  @Parameter
  private String workspaceUrlName;
  
  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

  @RequestAction
  public void init() {
    workspaceNavigationBackingBean.setWorkspaceUrlName(getWorkspaceUrlName());
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
}