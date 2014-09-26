package fi.muikku.plugins.students;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;


@Named
@Stateful
@RequestScoped
@Join (path = "/students/{workspaceUrlName}/index", to = "/students/index.jsf")
public class EnvironmentStudentsBackingBean {
  
  @Parameter
  private String workspaceUrlName;
  
  public String getWorkspaceUrlName(){
    return workspaceUrlName;    
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName){
    this.workspaceUrlName = workspaceUrlName;
  }
  
}
