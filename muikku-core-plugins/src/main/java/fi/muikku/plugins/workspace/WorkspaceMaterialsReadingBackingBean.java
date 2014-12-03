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
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/materials-reading", to = "/workspaces/materials-reading.jsf")
public class WorkspaceMaterialsReadingBackingBean {

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
	public void init() throws FileNotFoundException {
	  String urlName = getWorkspaceUrlName();
	  
		if (StringUtils.isBlank(urlName)) {
			throw new FileNotFoundException();
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(urlName);
		if (workspaceEntity == null) {
			throw new FileNotFoundException();
		}
		
		rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    
    workspaceNavigationBackingBean.setWorkspaceUrlName(urlName);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    workspaceName = workspace.getName();
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
  
	private WorkspaceRootFolder rootFolder;
  private String workspaceName;
}