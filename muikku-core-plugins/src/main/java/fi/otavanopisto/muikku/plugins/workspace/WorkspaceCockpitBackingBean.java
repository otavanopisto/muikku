package fi.otavanopisto.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;


@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/cockpit", to = "/jsf/workspace/workspace-cockpit.jsf")
public class WorkspaceCockpitBackingBean {
  
  @Parameter
  private String workspaceUrlName;
  
  public String getWorkspaceUrlName(){
    return workspaceUrlName;    
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName){
    this.workspaceUrlName = workspaceUrlName;
  }
  
}
