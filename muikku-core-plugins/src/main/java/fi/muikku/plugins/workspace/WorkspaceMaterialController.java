package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

@Dependent
@Stateful
public class WorkspaceMaterialController {

	@Inject
	private WorkspaceRootFolderDAO workspaceRootFolderDAO;
	
	@Inject
	private WorkspaceMaterialDAO workspaceMaterialDAO;

	@Inject
	private WorkspaceFolderDAO workspaceFolderDAO;

	@Inject
	private WorkspaceNodeDAO workspaceNodeDAO;
	
	/* Node */

	public WorkspaceNode findWorkspaceNodeById(Long workspaceMaterialId) {
		return workspaceNodeDAO.findById(workspaceMaterialId);
	}
	
	public WorkspaceNode findWorkspaceNodeByParentAndUrlName(WorkspaceNode parent, String urlName) {
		return workspaceNodeDAO.findByParentAndUrlName(parent, urlName);
	}
	
	public List<WorkspaceNode> listWorkspaceNodesByParent(WorkspaceNode parent) {
		return workspaceNodeDAO.listByParent(parent);
	}

	/* Material */
	
	public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String urlName) {
		return workspaceMaterialDAO.create(parent, material, urlName);
	}
	
	public WorkspaceMaterial findWorkspaceMaterialById(Long workspaceMaterialId) {
		return workspaceMaterialDAO.findById(workspaceMaterialId);
	}
	
  public WorkspaceMaterial findWorkspaceMaterialByParentAndUrlName(WorkspaceNode parent, String urlName) {
		return workspaceMaterialDAO.findByFolderAndUrlName(parent, urlName);
	}

	public WorkspaceMaterial findWorkspaceMaterialByWorkspaceEntityAndPath(WorkspaceEntity workspaceEntity, String path) {
		String[] pathElements = path.split("/");
		WorkspaceNode parent = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
		
		for (int i = 0, l = pathElements.length; i < l - 1; i++) {
			String pathElement = pathElements[i];
			parent = findWorkspaceNodeByParentAndUrlName(parent, pathElement);
		}
		
		return findWorkspaceMaterialByParentAndUrlName(parent, pathElements[pathElements.length - 1]);
	}

	public List<WorkspaceMaterial> listWorkspaceMaterialsByParent(WorkspaceNode parent) {
		return workspaceMaterialDAO.listByParent(parent);
	}
	
	/* Root Folder */
	
	public WorkspaceRootFolder createWorkspaceFolder(WorkspaceEntity workspaceEntity) {
    return workspaceRootFolderDAO.create(workspaceEntity);
	}
	
	public WorkspaceRootFolder findWorkspaceRootFolderByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
		return workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntity.getId());
	}
	
	/* Folder */

	public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String urlName) {
		return workspaceFolderDAO.create(parent, urlName);
	}
	
	public WorkspaceFolder findWorkspaceFolderById(Long workspaceFolderId) {
		return workspaceFolderDAO.findById(workspaceFolderId);
	}
	
}
