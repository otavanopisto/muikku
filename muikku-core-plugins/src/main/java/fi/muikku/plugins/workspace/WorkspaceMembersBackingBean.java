package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
@URLMapping(
    id = "workspace-members", 
    pattern = "/workspace/#{workspaceMembersBackingBean.workspaceUrlName}/members", 
    viewId = "/workspaces/workspace-members.jsf") 
})
public class WorkspaceMembersBackingBean {

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

  @URLAction
  public void init() throws FileNotFoundException {
    String urlName = getWorkspaceUrlName();
    if (StringUtils.isBlank(urlName)) {
      throw new FileNotFoundException();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      throw new FileNotFoundException();
    }
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);

    workspaceId = workspaceEntity.getId();
  }
  
  public Long getWorkspaceId() {
    return workspaceId;
  }
  
  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }
  
  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  private Long workspaceId;
  private String workspaceUrlName;
}
