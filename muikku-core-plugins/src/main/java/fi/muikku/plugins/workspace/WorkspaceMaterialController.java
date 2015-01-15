package fi.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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
import fi.muikku.plugins.workspace.model.WorkspaceNodeType;
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
  
  private static final int FLATTENING_LEVEL = 3;

  /* WorkspaceNode */

  /**
   * Updates the order numbers of workspace nodes so that <code>workspaceNode</code> appears above <code>referenceNode</code>.
   * 
   * @param workspaceNode The workspace node to be moved
   * @param referenceNode The workspace node above which <code>workspaceNode</code> is moved
   * 
   * @return The updated workspace node
   */
  public WorkspaceNode moveAbove(WorkspaceNode workspaceNode, WorkspaceNode referenceNode) {
    // Order number of the reference node
    Integer referenceOrderNumber = referenceNode.getOrderNumber() == null ? 0 : referenceNode.getOrderNumber();
    // Workspace nodes with order number >= reference order number
    List<WorkspaceNode> subsequentNodes = workspaceNodeDAO.listByOrderNumberEqualOrGreater(referenceNode);
    // Sort workspace nodes according to order number
    sortWorkspaceNodes(subsequentNodes);
    // node order number = referenceOrderNumber, subsequent nodes = ++referenceOrderNumber
    workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, referenceOrderNumber);
    for (WorkspaceNode subsequentNode : subsequentNodes) {
      workspaceNodeDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
    }
    return workspaceNode;
  }

  /**
   * Updates the order numbers of workspace nodes so that <code>workspaceNode</code> appears below <code>referenceNode</code>.
   * 
   * @param workspaceNode The workspace node to be moved
   * @param referenceNode The workspace node below which <code>workspaceNode</code> is moved
   * 
   * @return The updated workspace node
   */
  public WorkspaceNode moveBelow(WorkspaceNode workspaceNode, WorkspaceNode referenceNode) {
    // Order number of the reference node
    Integer referenceOrderNumber = referenceNode.getOrderNumber() == null ? 0 : referenceNode.getOrderNumber();
    // Workspace nodes with order number > reference order number
    List<WorkspaceNode> subsequentNodes = workspaceNodeDAO.listByOrderNumberGreater(referenceNode);
    // Sort workspace nodes according to order number
    sortWorkspaceNodes(subsequentNodes);
    // node order number = referenceOrderNumber + 1, subsequent nodes = ++referenceOrderNumber
    workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, ++referenceOrderNumber);
    for (WorkspaceNode subsequentNode : subsequentNodes) {
      workspaceNodeDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
    }
    return workspaceNode;
  }
  
  public WorkspaceNode findWorkspaceNodeNextSibling(WorkspaceNode referenceNode) {
    List<WorkspaceNode> nextSiblings = workspaceNodeDAO.listParentByOrderNumberGreaterSortByGreater(referenceNode.getParent(),
        referenceNode.getOrderNumber(), 0, 1);
    if (nextSiblings.isEmpty()) {
      return null;
    }

    return nextSiblings.get(0);
  }

  /**
   * Sorts the given list of workspace nodes.
   * 
   * @param workspaceNodes
   *          The list of workspace nodes to sort
   */
  public void sortWorkspaceNodes(List<WorkspaceNode> workspaceNodes) {
    Collections.sort(workspaceNodes, new Comparator<WorkspaceNode>() {
      @Override
      public int compare(WorkspaceNode o1, WorkspaceNode o2) {
        int o1OrderNumber = o1.getOrderNumber() == null ? 0 : o1.getOrderNumber();
        int o2OrderNumber = o2.getOrderNumber() == null ? 0 : o2.getOrderNumber();
        return o1OrderNumber - o2OrderNumber;
      }
    });
  }

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
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    if (workspaceNode instanceof WorkspaceMaterial) {
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) workspaceNode;
      Material material = getMaterialForWorkspaceMaterial(workspaceMaterial);
      Material clonedMaterial = materialController.cloneMaterial(material);
      newNode = workspaceMaterialDAO.create(parent, clonedMaterial.getId(), generateUniqueUrlName(parent, clonedMaterial.getTitle()), index);
    } else if (workspaceNode instanceof WorkspaceFolder) {
      newNode = workspaceFolderDAO.create(parent, ((WorkspaceFolder) workspaceNode).getTitle(),
          generateUniqueUrlName(parent, ((WorkspaceFolder) workspaceNode).getTitle()), index);
    } else {
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
      String urlName = generateUniqueUrlName(workspaceMaterial.getParent(), workspaceMaterial, originMaterial.getTitle());
      if (!workspaceMaterial.getUrlName().equals(urlName)) {
        workspaceMaterialDAO.updateUrlName(workspaceMaterial, urlName);
      }
    }
    return workspaceMaterial;
  }

  /* Workspace material */

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material) {
    String urlName = generateUniqueUrlName(parent, material.getTitle());
    return createWorkspaceMaterial(parent, material, urlName);
  }
  
  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String urlName) {
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    WorkspaceMaterial workspaceMaterial = workspaceMaterialDAO.create(parent, material.getId(), urlName, index);
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

  public WorkspaceNode updateWorkspaceNode(WorkspaceNode workspaceNode, Long materialId, WorkspaceNode parentNode, WorkspaceNode nextSibling, Boolean hidden) {
    // Material id
    if (workspaceNode instanceof WorkspaceMaterial) {
      workspaceNode = workspaceMaterialDAO.updateMaterialId((WorkspaceMaterial) workspaceNode, materialId);
    }
    // Parent node
    if (!workspaceNode.getParent().getId().equals(parentNode.getId())) {
      while (parentNode != null) {
        if (parentNode.getId().equals(workspaceNode.getId())) {
          throw new IllegalArgumentException("Circular reference " + workspaceNode.getId() + " with parent " + parentNode.getId());
        }
        parentNode = parentNode.getParent();
      }
      workspaceNode = workspaceNodeDAO.updateParent(workspaceNode,  parentNode);
    }
    // Next sibling
    if (nextSibling == null) {
      Integer orderNumber = workspaceNodeDAO.getMaximumOrderNumber(parentNode);
      orderNumber = orderNumber == null ? 0 : orderNumber;
      if (workspaceNode.getOrderNumber() < orderNumber) {
        workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, ++orderNumber);
      }
    }
    else {
      workspaceNode = moveAbove(workspaceNode, nextSibling);
    }
    // Next sibling
    workspaceNode = workspaceNodeDAO.updateHidden(workspaceNode, hidden);
    // Updated node
    return workspaceNode;
  }

  /**
   * Hides the given workspace node.
   * 
   * @param workspaceNode
   *          Workspace node
   */
  private void hide(WorkspaceNode workspaceNode) {
    setHidden(workspaceNode, Boolean.TRUE);
  }

  /**
   * Shows the given workspace node.
   * 
   * @param workspaceNode
   *          Workspace node
   */
  private void show(WorkspaceNode workspaceNode) {
    setHidden(workspaceNode, Boolean.FALSE);
  }

  /**
   * Hides or shows the given workspace node.
   * 
   * @param workspaceNode
   *          Workspace node
   * @param hidden
   *          <code>Boolean.TRUE</code> to hide the workspace node, <code>Boolean.FALSE</code> to show it
   */
  private void setHidden(WorkspaceNode workspaceNode, Boolean hidden) {
    workspaceNodeDAO.updateHidden(workspaceNode, hidden);
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
  
  /**
   * Returns the identifier of the workspace entity the given workspace node belongs to.
   * 
   * @param workspaceNode The workspace node
   * 
   * @return The identifier of the workspace entity the given workspace node belongs to
   */
  public Long getWorkspaceEntityId(WorkspaceNode workspaceNode) {
    WorkspaceNode rootFolder = workspaceNode;
    while (rootFolder.getParent() != null) {
      rootFolder = rootFolder.getParent();
    }
    if (!(rootFolder instanceof WorkspaceRootFolder)) {
      throw new IllegalArgumentException("WorkspaceNode " + workspaceNode.getId() + " has not root folder");
    }
    return ((WorkspaceRootFolder) rootFolder).getWorkspaceEntityId();
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
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    WorkspaceFolder workspaceFolder = workspaceFolderDAO.create(parent, title, urlName, index);
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

  public List<FlattenedWorkspaceNode> flattenWorkspaceNodes(List<WorkspaceNode> workspaceNodes, int level) {
    List<FlattenedWorkspaceNode> result = new ArrayList<>();
    
    for (WorkspaceNode workspaceNode : workspaceNodes) {
      if (workspaceNode.getType() == WorkspaceNodeType.FOLDER) {
        WorkspaceFolder workspaceFolder = (WorkspaceFolder)workspaceNode;
        List<WorkspaceNode> children = listWorkspaceNodesByParent(workspaceFolder);
        WorkspaceFolder emptyFolder = new WorkspaceFolder();
        emptyFolder.setHidden(workspaceFolder.getHidden());
        emptyFolder.setParent(workspaceFolder.getParent());
        emptyFolder.setOrderNumber(workspaceFolder.getOrderNumber());
        emptyFolder.setTitle(workspaceFolder.getTitle());
        emptyFolder.setUrlName(workspaceFolder.getUrlName());
        result.add(new FlattenedWorkspaceNode(emptyFolder, level));
        for (WorkspaceNode child : children) {
            result.add(new FlattenedWorkspaceNode(child, level+1));
        }
      } else {
        result.add(new FlattenedWorkspaceNode(workspaceNode, level));
      }
    }
    
    return result;
  }
  
  public ContentNode createContentNode(WorkspaceNode rootMaterialNode) {
    return createContentNode(rootMaterialNode, 1);
  }

  public ContentNode createContentNode(WorkspaceNode rootMaterialNode, int level) {
    switch (rootMaterialNode.getType()) {
    case FOLDER:
      WorkspaceFolder workspaceFolder = (WorkspaceFolder) rootMaterialNode;
      ContentNode folderContentNode = new ContentNode(
          workspaceFolder.getTitle(), "folder", rootMaterialNode.getId(), null, level);

      List<WorkspaceNode> children = listWorkspaceNodesByParent(workspaceFolder);
      List<FlattenedWorkspaceNode> flattenedChildren;
      if (level >= FLATTENING_LEVEL) {
        flattenedChildren = flattenWorkspaceNodes(children, level);
      } else {
        flattenedChildren = new ArrayList<>();
        for (WorkspaceNode node : children) {
          flattenedChildren.add(new FlattenedWorkspaceNode(node, level));
        }
      }
      for (FlattenedWorkspaceNode child : flattenedChildren) {
        folderContentNode.addChild(createContentNode(child.node, child.level));
      }

      return folderContentNode;
    case MATERIAL:
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) rootMaterialNode;
      Material material = materialController.findMaterialById(workspaceMaterial
          .getMaterialId());
      return new ContentNode(material.getTitle(), material.getType(),
          rootMaterialNode.getId(), material.getId(), level);
    default:
      return null;
    }
  }


  public synchronized String generateUniqueUrlName(String title) {
    return generateUniqueUrlName(null, null, title);
  }

  public synchronized String generateUniqueUrlName(WorkspaceNode parent, String title) {
    return generateUniqueUrlName(parent, null, title);
  }

  public synchronized String generateUniqueUrlName(WorkspaceNode parent, WorkspaceNode targetNode, String title) {
    if (StringUtils.isBlank(title)) {
      // no title to work with, so settle for a random UUID
      title = UUID.randomUUID().toString();
    }
    String urlName = generateUrlName(title);
    // use urlName as base and uniqueName as final result
    String uniqueName = urlName;
    if (parent != null) {
      // if parent node is given, ensure that the generated url name is unique amongst its child nodes
      int i = 1;
      while (true) {
        // find child node with uniqueName
        WorkspaceNode workspaceNode = workspaceNodeDAO.findByParentAndUrlName(parent, uniqueName);
        if (workspaceNode != null) {
          if (targetNode != null && workspaceNode.getId().equals(targetNode.getId())) {
            // uniqueName is in use but by the target node itself, so it's okay
            break;
          }
          // uniqueName in use, try again with the next candidate (name, name-2, name-3, etc.)
          uniqueName = urlName + "-" + ++i;
        } else {
          // Current uniqueName is available
          break;
        }
      }
    }
    return uniqueName;
  }

  public static String generateUrlName(String title) {
    // convert to lower-case and replace spaces and slashes with a minus sign
    String urlName = StringUtils.lowerCase(title.replaceAll(" ", "-").replaceAll("/", "-"));
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus, period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return urlName;
  }
  
  private static class FlattenedWorkspaceNode {
    
    public FlattenedWorkspaceNode(WorkspaceNode node, int level) {
      this.node = node;
      this.level = level;
    }
    
    public final WorkspaceNode node;
    public final int level;
  }

}
