package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.workspace.MaterialNode;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

@Named
@Stateless
public class WorkspaceMaterialsTOCBackingBean {

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  public List<MaterialNode> getAllMaterialNodes(WorkspaceNode rootFolder) {
    List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(rootFolder);
    for (WorkspaceNode node : nodes) {
      appendMaterialNode(node,  materialNodes);
    }
    return materialNodes;
  }

  /**
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode The workspace node
   * 
   * @return The children of the given workspace node as material nodes
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
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode The workspace node
   * 
   * @return The children of the given workspace node as material nodes
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
   * Appends the given workspace node and all of its descendants as material nodes to the given list of material nodes.
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
  
  /**
   * Converts the given workspace node into a material node.
   * 
   * @param workspaceNode The workspace node to convert
   * 
   * @return The given workspace node converted into a material node
   */
  private MaterialNode convertWorkspaceNode(WorkspaceNode workspaceNode) {
    // Create the MaterialNode to represent the given WorkspaceNode 
    MaterialNode materialNode = new MaterialNode();
    materialNode.setWorkspaceMaterialId(workspaceNode.getId());
    if (workspaceNode instanceof WorkspaceMaterial) {
      Material material = ((WorkspaceMaterial) workspaceNode).getMaterial();
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

}
