package fi.muikku.plugins.workspace;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/materials", to = "/workspaces/materials.jsf")
@LoggedIn
public class WorkspaceMaterialsBackingBean {

  @Parameter
  private String workspaceUrlName;
  
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

	@Inject
  @Named
  private WorkspaceNavigationBackingBean workspaceNavigationBackingBean;

	@RequestAction
	public String init() {
	  String urlName = getWorkspaceUrlName();
	  
		if (StringUtils.isBlank(urlName)) {
	     return NavigationRules.NOT_FOUND;
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
		if (workspaceEntity == null) {
	     return NavigationRules.NOT_FOUND;
		}
		
		rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
    workspaceEntityId = workspaceEntity.getId();
    
    return null;
	}
	
	public WorkspaceRootFolder getRootFolder() {
		return rootFolder;
	}
	
	public void setRootFolder(WorkspaceRootFolder rootFolder) {
		this.rootFolder = rootFolder;
	}
	
	public String getWorkspaceUrlName() {
		return workspaceUrlName;
	}

	public void setWorkspaceUrlName(String workspaceUrlName) {
		this.workspaceUrlName = workspaceUrlName;
	}

  public String getWorkspaceName() {
    return workspaceName;
  }
  
	public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  private WorkspaceRootFolder rootFolder;
  private String workspaceName;
  private Long workspaceEntityId;

}
