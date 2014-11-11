package fi.muikku.plugins.workspace;

import java.util.List;
import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.muikku.plugins.workspace.events.WorkspaceFolderCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceFolderUpdateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialCreateEvent;
import fi.muikku.plugins.workspace.events.WorkspaceMaterialDeleteEvent;
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
  
  @SuppressWarnings("unused")
  @Inject
  private Event<WorkspaceRootFolderUpdateEvent> workspaceRootFolderUpdateEvent;
  
  @Inject
  private Event<WorkspaceFolderCreateEvent> workspaceFolderCreateEvent;
  
  @SuppressWarnings("unused")
  @Inject
  private Event<WorkspaceFolderUpdateEvent> workspaceFolderUpdateEvent;
	
	@Inject
	private Event<WorkspaceMaterialCreateEvent> workspaceMaterialCreateEvent;
	
	@SuppressWarnings("unused")
  @Inject
  private Event<WorkspaceMaterialUpdateEvent> workspaceMaterialUpdateEvent;

	@Inject
  private Event<WorkspaceMaterialDeleteEvent> workspaceMaterialDeleteEvent;

  @Inject
	private MaterialController materialController;
  
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
	
	public Material getMaterialForWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
	  return materialController.findMaterialById(workspaceMaterial.getMaterialId());
	}
	
	public WorkspaceNode cloneWorkspaceNode(WorkspaceNode workspaceNode, WorkspaceNode parent) {
	  WorkspaceNode newNode;
	  if (workspaceNode instanceof WorkspaceMaterial) {
	    WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) workspaceNode;
	    Material material = getMaterialForWorkspaceMaterial(workspaceMaterial);
	    Material clonedMaterial = materialController.cloneMaterial(material);
	    newNode = workspaceMaterialDAO.create(parent, clonedMaterial.getId(), generateUrlName(parent, clonedMaterial.getTitle()));
	  }
	  else if (workspaceNode instanceof WorkspaceFolder) {
	    newNode = workspaceFolderDAO.create(parent, ((WorkspaceFolder) workspaceNode).getTitle(), generateUrlName(parent, ((WorkspaceFolder) workspaceNode).getTitle()));
    }
    else {
      throw new IllegalArgumentException("Uncloneable workspace node " + workspaceNode.getClass());
    }
	  List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParent(workspaceNode);
	  for (WorkspaceNode childNode : childNodes) {
	    cloneWorkspaceNode(childNode, newNode);
	  }
	  return newNode;
	}
	
  public WorkspaceMaterial revertToOriginMaterial(WorkspaceMaterial workspaceMaterial) {
    return revertToOriginMaterial(workspaceMaterial, false);
  }

  public WorkspaceMaterial revertToOriginMaterial(WorkspaceMaterial workspaceMaterial, boolean updateUrlName) {
	  Material originMaterial = getMaterialForWorkspaceMaterial(workspaceMaterial).getOriginMaterial();
	  if (originMaterial == null) {
	    throw new IllegalArgumentException("WorkSpaceMaterial has no origin material");
	  }
	  workspaceMaterialDAO.updateMaterialId(workspaceMaterial, originMaterial.getId());
	  if (updateUrlName) {
	    String urlName = generateUrlName(workspaceMaterial.getParent(), workspaceMaterial, originMaterial.getTitle());
	    if (!workspaceMaterial.getUrlName().equals(urlName)) {
	      workspaceMaterialDAO.updateUrlName(workspaceMaterial, urlName);
	    }
	  }
	  return workspaceMaterial;
	}
	
	/* Material */
	
	public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material) {
		String urlName = generateUrlName(parent,  material.getTitle());
	  WorkspaceMaterial workspaceMaterial = workspaceMaterialDAO.create(parent, material.getId(), urlName);
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

  public List<WorkspaceMaterial> listWorkspaceMaterialsByMaterial(Material material) {
    return workspaceMaterialDAO.listByMaterialId(material.getId());
  }
  
	public void deleteWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
	  workspaceMaterialDeleteEvent.fire(new WorkspaceMaterialDeleteEvent(workspaceMaterial));
	  
	  List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParent(workspaceMaterial);
	  for (WorkspaceNode childNode : childNodes) {
	    if (childNode instanceof WorkspaceMaterial) {
	      deleteWorkspaceMaterial((WorkspaceMaterial) childNode);
	    } else if (childNode instanceof WorkspaceFolder) {
	      deleteWorkspaceFolder((WorkspaceFolder) childNode);
	    } 
	  }
	  
	  workspaceMaterialDAO.delete(workspaceMaterial);
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
  
  public void deleteWorkspaceFolder(WorkspaceFolder workspaceFolder) {
    workspaceFolderDAO.delete(workspaceFolder);
  }
  
  /* Utility methods */

  public synchronized String generateUrlName(String title) {
    return generateUrlName(null, null, title);
  }

  public synchronized String generateUrlName(WorkspaceNode parent, String title) {
    return generateUrlName(parent, null, title);
  }
  
  public synchronized String generateUrlName(WorkspaceNode parent, WorkspaceNode targetNode, String title) {
    if (StringUtils.isBlank(title)) {
      // no title to work with, so settle for a random UUID
      title = UUID.randomUUID().toString();
    }
    // convert to lower-case and replace spaces and slashes with a minus sign  
    String urlName = StringUtils.lowerCase(title.replaceAll(" ", "-").replaceAll("/", "-")); 
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus, period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    // use urlName as base and uniqueName as final result
    String uniqueName = urlName;
    if (parent != null) {
      // if parent node is given, ensure that the generated url name is unique amongst its child nodes
      int i = 1;
      while (true) {
        // find child node with uniqueName
        WorkspaceNode workspaceNode = workspaceNodeDAO.findByParentAndUrlName(parent,  uniqueName);
        if (workspaceNode != null) {
          if (targetNode != null && workspaceNode.getId().equals(targetNode.getId())) {
            // uniqueName is in use but by the target node itself, so it's okay
            break;
          }
          // uniqueName in use, try again with the next candidate (name, name-2, name-3, etc.)
          uniqueName = urlName + "-" + ++i;
        }
        else {
          // Current uniqueName is available
          break;
        }
      }
    }
    return uniqueName;
  }

}