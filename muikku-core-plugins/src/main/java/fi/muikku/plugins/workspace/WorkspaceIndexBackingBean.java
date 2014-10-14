package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}", to = "/workspaces/workspace.jsf")
public class WorkspaceIndexBackingBean {
  
  @Parameter
  private String workspaceUrlName;

	@Inject
	private WorkspaceController workspaceController;

  @Inject
  @Named
	private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@RequestAction
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
  
  public String getWorkspaceName() {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceId);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace != null) {
      return workspace.getName();
    } else {
      return null;
    }
  }
  
	private Long workspaceId;
}
