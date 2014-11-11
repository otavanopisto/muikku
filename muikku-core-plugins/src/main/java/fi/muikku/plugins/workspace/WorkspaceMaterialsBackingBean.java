package fi.muikku.plugins.workspace;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

@Named
@Stateful
@RequestScoped
@Join (path = "/workspace/{workspaceUrlName}/materials", to = "/workspaces/materials.jsf")
public class WorkspaceMaterialsBackingBean {

  @Parameter
  private String workspaceUrlName;
  
	@Inject
	private WorkspaceController workspaceController;
	
	@Inject
	private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private MaterialController materialController;

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
	
	/**
	 * Returns a flat list of all the materials in the workspace.
	 *  
	 * @return A flat list of all materials in the workspace
	 */
	public List<MaterialNode> getMaterialNodes() {
	  List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
	  List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(rootFolder);
    sortWorkspaceNodes(nodes);
	  for (WorkspaceNode node : nodes) {
	    appendMaterialNode(node, materialNodes);
	  }
	  return materialNodes;
	}

	/**
	 * Returns the children of the given workspace node as MaterialNode instances.
	 * 
	 * @param workspaceNode The workspace node
	 * 
	 * @return The children of the given workspace node as MaterialNode instances
	 */
	public List<MaterialNode> getMaterialNodes(WorkspaceNode workspaceNode) {
	  List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
	  sortWorkspaceNodes(nodes);
	  List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
	  for (WorkspaceNode node : nodes) {
	    materialNodes.add(convertWorkspaceNode(node));
	  }
	  return materialNodes;
  }

	/**
   * Returns the children of the given workspace node as MaterialNode instances.
   * 
   * @param workspaceNode The workspace node
   * 
   * @return The children of the given workspace node as MaterialNode instances
   */
  public List<MaterialNode> getMaterialNodes(MaterialNode parent) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeById(parent.getWorkspaceMaterialId());
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
    sortWorkspaceNodes(nodes);
    List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
    for (WorkspaceNode node : nodes) {
      materialNodes.add(convertWorkspaceNode(node));
    }
    return materialNodes;
  }
	
	/**
	 * Appends the given workspace node and all of its descendants as MaterialNode instances to the given list of material nodes.
	 * 
	 * @param workspaceNode The workspace node (and its descendants) to be converted into a MaterialNode instance
	 * @param materialNodes The list of material nodes
	 */
	private void appendMaterialNode(WorkspaceNode workspaceNode, List<MaterialNode> materialNodes) {
    // Create the MaterialNode to represent the given WorkspaceNode 
	  MaterialNode materialNode = convertWorkspaceNode(workspaceNode);
    materialNodes.add(materialNode);
    // Recursively convert the children of the given WorkspaceNode to MaterialNode instances   
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
    sortWorkspaceNodes(nodes);
	  for (WorkspaceNode node : nodes) {
	    appendMaterialNode(node, materialNodes);
	  }
	}
	
	private MaterialNode convertWorkspaceNode(WorkspaceNode workspaceNode) {
    // Create the MaterialNode to represent the given WorkspaceNode 
    MaterialNode materialNode = new MaterialNode();
    materialNode.setWorkspaceMaterialId(workspaceNode.getId());
    if (workspaceNode instanceof WorkspaceMaterial) {
      Material material = materialController.findMaterialById(((WorkspaceMaterial) workspaceNode).getMaterialId());
      materialNode.setMaterialId(material.getId());
      materialNode.setMaterialType(material.getType());
      materialNode.setMaterialTitle(material.getTitle());
    }
    else if (workspaceNode instanceof WorkspaceFolder) {
      // TODO questionable hard-coding 
      materialNode.setMaterialType("folder");
      materialNode.setMaterialTitle(((WorkspaceFolder) workspaceNode).getTitle());
    }
    else {
      throw new IllegalArgumentException("Unsupported workspace node: " + workspaceNode.getClass());
    }
    materialNode.setMaterialPath(workspaceNode.getPath());
    return materialNode;
	}
	
	/**
	 * Sorts the given list of workspace nodes.
	 * 
	 * @param workspaceNodes The list of workspace nodes to sort
	 */
	private void sortWorkspaceNodes(List<WorkspaceNode> workspaceNodes) {
	  // TODO implement meaningful sorting
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
  
  /**
   * Utility class to represent a workspace node as material in UI. 
   */
  public class MaterialNode {
    public Long getWorkspaceMaterialId() {
      return workspaceMaterialId;
    }
    public void setWorkspaceMaterialId(Long workspaceMaterialId) {
      this.workspaceMaterialId = workspaceMaterialId;
    } 
    public Long getMaterialId() {
      return materialId;
    }
    public void setMaterialId(Long materialId) {
      this.materialId = materialId;
    }
    public String getMaterialType() {
      return materialType;
    }
    public void setMaterialType(String materialType) {
      this.materialType = materialType;
    }
    public String getMaterialPath() {
      return materialPath;
    }
    public void setMaterialPath(String materialPath) {
      this.materialPath = materialPath;
    }
    public String getMaterialTitle() {
      return materialTitle;
    }
    public void setMaterialTitle(String materialTitle) {
      this.materialTitle = materialTitle;
    }
    // The id of the WorkspaceNode this material represents
    private Long workspaceMaterialId;
    // The id of the Material referenced by WorkspaceNode; null for folders
    private Long materialId;
    // The type of the Material referenced by WorkspaceNode, e.g. folder, html, binary
    private String materialType;
    // Material title
    private String materialTitle;
    // Relative path of the WorkspaceNode 
    private String materialPath;
  }

}
