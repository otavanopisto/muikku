package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;

@SuppressWarnings("el-syntax")
@Named
@Stateful
@RequestScoped
@URLMappings(mappings = { 
  @URLMapping(
	  id = "workspace-materials", 
  	pattern = "/workspace/#{workspaceMaterialsBackingBean.workspaceUrlName}/materials", 
  	viewId = "/workspaces/workspace-materials.jsf"
  )}
)
public class WorkspaceMaterialsBackingBean {
	
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

	@URLAction
	public void init() throws FileNotFoundException {
		if (StringUtils.isBlank(getWorkspaceUrlName())) {
			throw new FileNotFoundException();
		}
		
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(getWorkspaceUrlName());

		if (workspaceEntity == null) {
			throw new FileNotFoundException();
		}
		
		rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
	}
	
	public List<WorkspaceNode> listWorkspaceNodes(WorkspaceNode workspaceNode) {
		return workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
	}
	
	public List<WorkspaceMaterial> listWorkspaceMaterials(WorkspaceNode workspaceNode) {
		return workspaceMaterialController.listWorkspaceMaterialsByParent(workspaceNode);
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

	private WorkspaceRootFolder rootFolder;
	private String workspaceUrlName;
}