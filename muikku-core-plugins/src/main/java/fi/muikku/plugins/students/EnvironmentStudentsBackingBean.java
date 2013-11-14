package fi.muikku.plugins.students;

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
      id = "environment-students", 
      pattern = "/students/#{environmentStudentsBackingBean.workspaceUrlName}/index", 
      viewId = "/students/index.jsf")
})

public class EnvironmentStudentsBackingBean {
  
  public String getWorkspaceUrlName(){
    return workspaceUrlName;    
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName){
    this.workspaceUrlName = workspaceUrlName;
  }
  
  private String workspaceUrlName;
  
}
