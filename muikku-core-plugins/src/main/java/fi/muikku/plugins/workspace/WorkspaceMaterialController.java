package fi.muikku.plugins.workspace;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.events.WorkspaceFolderCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceFolderUpdateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialUpdateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceRootFolderCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceRootFolderUpdateEvent;
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
  
  @Inject
  private Event<WorkspaceRootFolderCreateEvent> workspaceRootFolderCreateEvent;
  
  @Inject
  private Event<WorkspaceRootFolderUpdateEvent> workspaceRootFolderUpdateEvent;
  
  @Inject
  private Event<WorkspaceFolderCreateEvent> workspaceFolderCreateEvent;
  
  @Inject
  private Event<WorkspaceFolderUpdateEvent> workspaceFolderUpdateEvent;
	
	@Inject
	private Event<WorkspaceMaterialCreateEvent> workspaceMaterialCreateEvent;
	
	@Inject
  private Event<WorkspaceMaterialUpdateEvent> workspaceMaterialUpdateEvent;
  
	/* Node */

	public WorkspaceNode findWorkspaceNodeById(Long workspaceMaterialId) {
		return workspaceNodeDAO.findById(workspaceMaterialId);
	}
	
	public WorkspaceNode findWorkspaceNodeByParentAndUrlName(WorkspaceNode parent, String urlName) {
		return workspaceNodeDAO.findByParentAndUrlName(parent, urlName);
	}
	
	public WorkspaceNode findWorkspaceNodeByWorkspaceEntityAndPath(WorkspaceEntity workspaceEntity, String path) {
    String[] pathElements = path.split("/");
    WorkspaceNode parent = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    
    for (int i = 0, l = pathElements.length; i < l - 1; i++) {
      String pathElement = pathElements[i];
      parent = findWorkspaceNodeByParentAndUrlName(parent, pathElement);
    }
    
    return findWorkspaceNodeByParentAndUrlName(parent, pathElements[pathElements.length - 1]);
  }
	
	public List<WorkspaceNode> listWorkspaceNodesByParent(WorkspaceNode parent) {
		return workspaceNodeDAO.listByParent(parent);
	}

	/* Material */
	
	public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String urlName) {
		WorkspaceMaterial workspaceMaterial = workspaceMaterialDAO.create(parent, material, urlName);
		workspaceMaterialCreateEvent.fire(new WorkspaceMaterialCreateEvent(workspaceMaterial));
		return workspaceMaterial;
	}
	
	public WorkspaceMaterial findWorkspaceMaterialById(Long workspaceMaterialId) {
		return workspaceMaterialDAO.findById(workspaceMaterialId);
	}
	
  public WorkspaceMaterial findWorkspaceMaterialByParentAndUrlName(WorkspaceNode parent, String urlName) {
		return workspaceMaterialDAO.findByFolderAndUrlName(parent, urlName);
	}

  public WorkspaceMaterial findWorkspaceMaterialByWorkspaceEntityAndPath(WorkspaceEntity workspaceEntity, String path) {
    return (WorkspaceMaterial) findWorkspaceNodeByWorkspaceEntityAndPath(workspaceEntity, path);
  }
  
	public List<WorkspaceMaterial> listWorkspaceMaterialsByParent(WorkspaceNode parent) {
		return workspaceMaterialDAO.listByParent(parent);
	}
	
	/* Root Folder */
	
	public WorkspaceRootFolder createWorkspaceRootFolder(WorkspaceEntity workspaceEntity) {
    WorkspaceRootFolder workspaceRootFolder = workspaceRootFolderDAO.create(workspaceEntity);
    workspaceRootFolderCreateEvent.fire(new WorkspaceRootFolderCreateEvent(workspaceRootFolder));
    return workspaceRootFolder;
	}
	
	public WorkspaceRootFolder findWorkspaceRootFolderByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
		return workspaceRootFolderDAO.findByWorkspaceEntityId(workspaceEntity.getId());
	}

  public WorkspaceRootFolder findWorkspaceRootFolderByWorkspaceNode(WorkspaceNode workspaceNode) {
    WorkspaceNode node = workspaceNode;
    while ((node != null) && (!(node instanceof WorkspaceRootFolder))) {
      node = node.getParent();
    }

    return (WorkspaceRootFolder) node;
  }
	
	/* Folder */

	public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title, String urlName) {
		WorkspaceFolder workspaceFolder = workspaceFolderDAO.create(parent, title, urlName);
		workspaceFolderCreateEvent.fire(new WorkspaceFolderCreateEvent(workspaceFolder));
		return workspaceFolder;
	}
	
	public WorkspaceFolder findWorkspaceFolderById(Long workspaceFolderId) {
		return workspaceFolderDAO.findById(workspaceFolderId);
	}
	
}
