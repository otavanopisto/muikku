package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;

@Named
@Stateful
@RequestScoped
public class WorkspaceNavigationBackingBean {

  @Inject
  private WorkspaceController workspaceController;
  

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }
  
  public Long getWorkspaceId() {
    String urlName = getWorkspaceUrlName();
    if (StringUtils.isBlank(urlName)) {
      return null;
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
    if (workspaceEntity == null) {
      return null;
    }
    
    return workspaceEntity.getId();
  }

  private String workspaceUrlName;
}
