package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

@Dependent
@Stateful
public class WorkspaceMaterialController {
	
	@Inject
	private WorkspaceMaterialDAO workspaceMaterialDAO;

	@Inject
	private WorkspaceFolderDAO workspaceFolderDAO;
	
	/* Material */
	
	public WorkspaceMaterial createWorkspaceMaterial(WorkspaceFolder folder, Material material) {
		return workspaceMaterialDAO.create(folder, material);
	}
	
	public WorkspaceMaterial findWorkspaceMaterialById(Long workspaceMaterialId) {
		return workspaceMaterialDAO.findById(workspaceMaterialId);
	}
	
  public WorkspaceMaterial findWorkspaceMaterialByFolderAndUrlName(WorkspaceFolder folder, String urlName) {
		return workspaceMaterialDAO.findByFolderAndUrlName(folder, urlName);
	}

	public WorkspaceMaterial findWorkspaceMaterialByWorkspaceEntityAndPath(WorkspaceEntity workspaceEntity, String path) {
		String[] pathElements = path.split("/");
		WorkspaceFolder parent = findWorkspaceFolderByWorkspaceEntity(workspaceEntity);
		
		for (int i = 0, l = pathElements.length; i < l - 1; i++) {
			String pathElement = pathElements[i];
			parent = findWorkspaceFolderByParentAndUrlName(parent, pathElement);
		}
		
		return findWorkspaceMaterialByFolderAndUrlName(parent, pathElements[pathElements.length - 1]);
	}

	public List<WorkspaceMaterial> listWorkspaceMaterialsByFolder(WorkspaceFolder folder) {
		return workspaceMaterialDAO.listByFolder(folder);
	}
	
	/* Folder */
	
	public WorkspaceFolder createWorkspaceFolder(WorkspaceEntity workspaceEntity, String urlName) {
		if (workspaceEntity != null) {
  		return workspaceFolderDAO.create(workspaceEntity.getId(), null, urlName);
		} 
		
		return null;
	}

	public WorkspaceFolder createWorkspaceFolder(WorkspaceFolder parent, String urlName) {
		if (parent != null) {
  		return workspaceFolderDAO.create(null, parent, urlName);
		}
		
		return null;
	}
	
	public WorkspaceFolder findWorkspaceFolderById(Long workspaceFolderId) {
		return workspaceFolderDAO.findById(workspaceFolderId);
	}
	
	public WorkspaceFolder findWorkspaceFolderByParentAndUrlName(WorkspaceFolder parent, String urlName) {
		return workspaceFolderDAO.findByParentAndUrlName(parent, urlName);
	}
	
	public WorkspaceFolder findWorkspaceFolderByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
		return workspaceFolderDAO.findByWorkspaceEntityId(workspaceEntity.getId());
	}
	
	public List<WorkspaceFolder> listWorkspaceFoldersByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
		return workspaceFolderDAO.listByWorkspaceEntityId(workspaceEntity.getId());
	}
	
	public List<WorkspaceFolder> listWorkspaceFoldersByParent(WorkspaceFolder parent) {
		return workspaceFolderDAO.listByParent(parent);
	}
	
}
