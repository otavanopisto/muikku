package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.plugins.material.MaterialController;
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

  @Inject
  private MaterialController materialController;

  /**
   * Returns a flat list of all workspace nodes under the given root folder as <code>MaterialNode</code> instances.
   * 
   * @param rootFolder
   *          The root folder
   * 
   * @return A flat list of all workspace nodes under the given root folder
   */
  public List<MaterialNode> getDescendants(WorkspaceNode rootFolder) {
    return getDescendants(rootFolder, Boolean.TRUE);
  }

  /**
   * Returns a flat list of all workspace nodes under the given root folder as <code>MaterialNode</code> instances, including hidden
   * workspace nodes.
   * 
   * @param rootFolder
   *          The root folder
   * 
   * @return A flat list of all workspace nodes under the given root folder
   */
  public List<MaterialNode> getVisibleDescendants(WorkspaceNode rootFolder) {
    return getDescendants(rootFolder, Boolean.FALSE);
  }

  /**
   * Returns a flat list of all workspace nodes under the given root folder as <code>MaterialNode</code> instances.
   * 
   * @param rootFolder
   *          The root folder
   * @param includeHidden
   *          Include hidden workspace nodes?
   * 
   * @return A flat list of all workspace nodes under the given root folder
   */
  public List<MaterialNode> getDescendants(WorkspaceNode rootFolder, Boolean includeHidden) {
    List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(rootFolder);
    for (WorkspaceNode node : nodes) {
      if (includeHidden || !node.getHidden()) {
        appendMaterialNode(node, materialNodes, includeHidden);
      }
    }
    return materialNodes;
  }

  /**
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getChildren(WorkspaceNode workspaceNode) {
    return getChildren(workspaceNode, Boolean.TRUE);
  }

  /**
   * Returns the children of the given workspace node as material nodes, including hidden workspace nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getVisibleChildren(WorkspaceNode workspaceNode) {
    return getChildren(workspaceNode, Boolean.FALSE);
  }

  /**
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * @param includeHidden
   *          Include hidden workspace nodes?
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getChildren(WorkspaceNode workspaceNode, Boolean includeHidden) {
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
    workspaceMaterialController.sortWorkspaceNodes(nodes);
    List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
    for (WorkspaceNode node : nodes) {
      if (includeHidden || !node.getHidden()) {
        materialNodes.add(convertWorkspaceNode(node));
      }
    }
    return materialNodes;
  }

  /**
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getChildren(MaterialNode parent) {
    return getChildren(parent, Boolean.TRUE);
  }

  /**
   * Returns the children of the given workspace node as material nodes, including hidden workspace nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getVisibleChildren(MaterialNode parent) {
    return getChildren(parent, Boolean.FALSE);
  }

  /**
   * Returns the children of the given workspace node as material nodes.
   * 
   * @param workspaceNode
   *          The workspace node
   * @param includeHidden
   *          Include hidden workspace nodes?
   * 
   * @return The children of the given workspace node as material nodes
   */
  public List<MaterialNode> getChildren(MaterialNode parent, Boolean includeHidden) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeById(parent.getWorkspaceMaterialId());
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
    workspaceMaterialController.sortWorkspaceNodes(nodes);
    List<MaterialNode> materialNodes = new ArrayList<MaterialNode>();
    for (WorkspaceNode node : nodes) {
      if (includeHidden || !node.getHidden()) {
        materialNodes.add(convertWorkspaceNode(node));
      }
    }
    return materialNodes;
  }

  /**
   * Appends the given workspace node and all of its descendants as material nodes to the given list of material nodes.
   * 
   * @param workspaceNode
   *          The workspace node (and its descendants) to be converted into a MaterialNode instance
   * @param materialNodes
   *          The list of material nodes
   * @param includeHidden
   *          Include hidden workspace nodes?
   */
  private void appendMaterialNode(WorkspaceNode workspaceNode, List<MaterialNode> materialNodes, Boolean includeHidden) {
    // Create the MaterialNode to represent the given WorkspaceNode
    MaterialNode materialNode = convertWorkspaceNode(workspaceNode);
    materialNodes.add(materialNode);
    // Recursively convert the children of the given WorkspaceNode to MaterialNode instances
    List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(workspaceNode);
    workspaceMaterialController.sortWorkspaceNodes(nodes);
    for (WorkspaceNode node : nodes) {
      if (includeHidden || !node.getHidden()) {
        appendMaterialNode(node, materialNodes, includeHidden);
      }
    }
  }

  /**
   * Converts the given workspace node into a material node.
   * 
   * @param workspaceNode
   *          The workspace node to convert
   * 
   * @return The given workspace node converted into a material node
   */
  private MaterialNode convertWorkspaceNode(WorkspaceNode workspaceNode) {
    // Create the MaterialNode to represent the given WorkspaceNode
    MaterialNode materialNode = new MaterialNode();
    materialNode.setWorkspaceMaterialId(workspaceNode.getId());
    if (workspaceNode instanceof WorkspaceMaterial) {
      Material material = materialController.findMaterialById(((WorkspaceMaterial) workspaceNode).getMaterialId());
      materialNode.setMaterialId(material.getId());
      materialNode.setMaterialType(material.getType());
      materialNode.setMaterialTitle(material.getTitle());
    } else if (workspaceNode instanceof WorkspaceFolder) {
      // TODO questionable hard-coding
      materialNode.setMaterialType("folder");
      materialNode.setMaterialTitle(((WorkspaceFolder) workspaceNode).getTitle());
    } else {
      throw new IllegalArgumentException("Unsupported workspace node: " + workspaceNode.getClass());
    }
    materialNode.setMaterialPath(workspaceNode.getPath());
    materialNode.setParentId(workspaceNode.getParent().getId());
    materialNode.setMaterialHidden(workspaceNode.getHidden());
    return materialNode;
  }

}
