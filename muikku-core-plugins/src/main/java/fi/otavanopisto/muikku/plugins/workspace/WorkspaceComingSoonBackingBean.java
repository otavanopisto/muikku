package fi.otavanopisto.muikku.plugins.workspace;

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
@Join (path = "/workspace/{workspaceUrlName}/comingsoon", to = "/jsf/workspace/comingsoon.jsf")
public class WorkspaceComingSoonBackingBean {
  
  @Parameter
  private String workspaceUrlName;
  
  @Inject
  @Named
  private WorkspaceBackingBean workspaceBackingBean;

  @RequestAction
  public void init() {
    workspaceBackingBean.setWorkspaceUrlName(getWorkspaceUrlName());
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
}