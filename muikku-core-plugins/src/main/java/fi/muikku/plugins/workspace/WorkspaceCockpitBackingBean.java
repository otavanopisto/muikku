package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;


@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
      id = "workspace-cockpit", 
      pattern = "/workspace/#{workspaceCockpitBackingBean.workspaceUrlName}/cockpit", 
      viewId = "/workspaces/workspace-cockpit.jsf")
})

public class WorkspaceCockpitBackingBean {
  
  public String getWorkspaceUrlName(){
    return workspaceUrlName;    
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName){
    this.workspaceUrlName = workspaceUrlName;
  }
  
  private String workspaceUrlName;
  
}
