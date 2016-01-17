package fi.muikku.plugins.workspace;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.lang3.StringUtils;
import org.apache.xerces.parsers.DOMParser;
import org.cyberneko.html.HTMLConfiguration;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXNotRecognizedException;
import org.xml.sax.SAXNotSupportedException;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;
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
import fi.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.session.SessionController;

// TODO Should probably be split or renamed WorkspaceNodeController
public class WorkspaceMaterialController {

  @Inject
  private Logger logger;

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

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

  @Inject
  private HtmlMaterialController htmlMaterialController;

  private static final int FLATTENING_LEVEL = 1;

  /* WorkspaceNode */

  /**
   * Updates the order numbers of workspace nodes so that <code>workspaceNode</code> appears above <code>referenceNode</code>.
   * 
   * @param workspaceNode
   *          The workspace node to be moved
   * @param referenceNode
   *          The workspace node above which <code>workspaceNode</code> is moved
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
      if (!(subsequentNode.getId().equals(workspaceNode.getId()))) {
        workspaceNodeDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
      }
    }
    return workspaceNode;
  }

  /**
   * Updates the order numbers of workspace nodes so that <code>workspaceNode</code> appears below <code>referenceNode</code>.
   * 
   * @param workspaceNode
   *          The workspace node to be moved
   * @param referenceNode
   *          The workspace node below which <code>workspaceNode</code> is moved
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
    List<WorkspaceNode> nextSiblings = workspaceNodeDAO.listParentByOrderNumberGreaterSortByGreater(referenceNode.getParent(), referenceNode.getOrderNumber(),
        0, 1);
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

  public String getCompletePath(WorkspaceNode workspaceNode) {
    return String.format("workspace/%s/materials/%s", getWorkspaceNodeWorkspaceUrlName(workspaceNode), workspaceNode.getPath());
  }

  public WorkspaceMaterial findWorkspaceMaterialByRootPath(String path) {
    if (path.contains("?")) {
      path = StringUtils.substringBefore(path, "?");
    }
    String[] pathElements = StringUtils.split(path, "/");
    if (pathElements.length >= 3 && StringUtils.equals("workspace", pathElements[0]) && StringUtils.equals("materials", pathElements[2])) {
      String workspaceUrlName = pathElements[1];
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceUrlName);
      if (workspaceEntity != null) {
        WorkspaceNode workspaceNode = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
        for (int i = 3; i < pathElements.length; i++) {
          workspaceNode = findWorkspaceNodeByParentAndUrlName(workspaceNode, pathElements[i]);
          if (workspaceNode == null) {
            return null;
          }
        }
        return workspaceNode instanceof WorkspaceMaterial ? (WorkspaceMaterial) workspaceNode : null;
      }
    }
    return null;
  }
  
  public String getWorkspaceNodeWorkspaceUrlName(WorkspaceNode workspaceNode) {
    WorkspaceNode node = workspaceNode;
    
    while (node != null) {
      if (node instanceof WorkspaceRootFolder) {
        return ((WorkspaceRootFolder) node).getUrlName();
      }
      
      node = node.getParent();
    }

    return null;
  }
  
  public List<WorkspaceNode> listWorkspaceNodesByParent(WorkspaceNode parent) {
    return workspaceNodeDAO.listByParentSortByOrderNumber(parent);
  }

  public List<WorkspaceNode> listVisibleWorkspaceNodesByParentSortByOrderNumber(WorkspaceNode parent) {
    return listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(parent, WorkspaceFolderType.DEFAULT);
  }

  public List<WorkspaceNode> listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent, WorkspaceFolderType folderType) {
    List<WorkspaceNode> nodes = workspaceNodeDAO.listByParentSortByOrderNumber(parent);
    // TODO: Do in database
    for (int i = nodes.size() - 1; i >= 0; i--) {
      WorkspaceNode node = nodes.get(i);
      if (node instanceof WorkspaceFolder) {
        WorkspaceFolder folder = (WorkspaceFolder) node;
        if (folder.getFolderType() != folderType) {
          nodes.remove(i);
        }
      }
    }
    
    return nodes;
  }
  
  public List<WorkspaceFolder> listWorkspaceFoldersByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent, WorkspaceFolderType folderType) {
    List<WorkspaceFolder> nodes = workspaceFolderDAO.listByParentAndFolderType(parent, folderType);
    // TODO: Do in database
    for (int i = nodes.size() - 1; i >= 0; i--) {
      WorkspaceFolder node = nodes.get(i);
      if (node.getFolderType() != folderType) {
        nodes.remove(i);
      }
    }
    
    return nodes;
  }

  public List<WorkspaceNode> listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent, WorkspaceFolderType folderType) {
    List<WorkspaceNode> nodes = workspaceNodeDAO.listByParentAndHiddenSortByOrderNumber(parent, Boolean.FALSE);
    // TODO: Do in database
    for (int i = nodes.size() - 1; i >= 0; i--) {
      WorkspaceNode node = nodes.get(i);
      if (node instanceof WorkspaceFolder) {
        WorkspaceFolder folder = (WorkspaceFolder) node;
        if (folder.getFolderType() != folderType) {
          nodes.remove(i);
        }
      }
    }
    
    return nodes;
  }

  public void deleteAllWorkspaceNodes(WorkspaceEntity workspaceEntity) throws WorkspaceMaterialContainsAnswersExeption {
    WorkspaceRootFolder rootFolder = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    deleteAllChildNodes(rootFolder);
  }
  
  private void deleteAllChildNodes(WorkspaceNode node) throws WorkspaceMaterialContainsAnswersExeption {
    List<WorkspaceNode> childNodes = listWorkspaceNodesByParent(node);
    for (WorkspaceNode childNode : childNodes) {
      deleteAllChildNodes(childNode);
    }

    switch (node.getType()) {
      case FRONT_PAGE_FOLDER:
      case FOLDER:
        deleteWorkspaceFolder((WorkspaceFolder) node);
      break;
      case MATERIAL:
        deleteWorkspaceMaterial((WorkspaceMaterial) node, true);
      break;
      case ROOT_FOLDER:
        deleteWorkspaceRootFolder((WorkspaceRootFolder) node);
      break;
    }
  }

  public Material getMaterialForWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterial.getMaterialId() == null ? null : materialController.findMaterialById(workspaceMaterial.getMaterialId());
  }

  public WorkspaceNode cloneWorkspaceNode(WorkspaceNode workspaceNode, WorkspaceNode parent, boolean cloneMaterials) {
    return cloneWorkspaceNode(workspaceNode, parent, cloneMaterials, false);
  }

  private WorkspaceNode cloneWorkspaceNode(WorkspaceNode workspaceNode, WorkspaceNode parent, boolean cloneMaterials, boolean overrideCloneMaterials) {
    WorkspaceNode newNode;
    boolean isHtmlMaterial = false;
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    if (workspaceNode instanceof WorkspaceMaterial) {
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) workspaceNode;
      Material material = getMaterialForWorkspaceMaterial(workspaceMaterial);
      isHtmlMaterial = material instanceof HtmlMaterial;
      Material clonedMaterial = cloneMaterials && !overrideCloneMaterials ? materialController.cloneMaterial(material) : material;

      // Implementation of feature #1232 (front and help pages should always be copies)
      if (isHtmlMaterial && !cloneMaterials) {
        WorkspaceNode parentNode = workspaceMaterial.getParent();
        if (parentNode instanceof WorkspaceFolder) {
          WorkspaceFolder parentFolder = (WorkspaceFolder) parentNode;
          if (parentFolder.getFolderType() == WorkspaceFolderType.FRONT_PAGE || parentFolder.getFolderType() == WorkspaceFolderType.HELP_PAGE) {
            clonedMaterial = materialController.cloneMaterial(material);
          }
        }
      }
      
      newNode = createWorkspaceMaterial(
          parent,
          clonedMaterial,
          workspaceMaterial.getTitle(),
          generateUniqueUrlName(parent, workspaceMaterial.getUrlName()),
          index,
          workspaceMaterial.getHidden(),
          workspaceMaterial.getAssignmentType(),
          workspaceMaterial.getCorrectAnswers());
    }
    else if (workspaceNode instanceof WorkspaceFolder) {
      newNode = createWorkspaceFolder(
          parent,
          ((WorkspaceFolder) workspaceNode).getTitle(),
          generateUniqueUrlName(parent, workspaceNode.getUrlName()),
          index,
          workspaceNode.getHidden(),
          ((WorkspaceFolder) workspaceNode).getFolderType());
    }
    else {
      throw new IllegalArgumentException("Uncloneable workspace node " + workspaceNode.getClass());
    }
    List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentSortByOrderNumber(workspaceNode);
    for (WorkspaceNode childNode : childNodes) {
      cloneWorkspaceNode(childNode, newNode, cloneMaterials, isHtmlMaterial);
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
    return createWorkspaceMaterial(parent, material, null, null);
  }

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    String urlName = generateUniqueUrlName(parent, material.getTitle());
    return createWorkspaceMaterial(parent, material, urlName, assignmentType, correctAnswers);
  }

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String urlName, WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    return createWorkspaceMaterial(parent, material, material.getTitle(), urlName, index, false, assignmentType, correctAnswers);
  }
  
  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String title, String urlName, Integer index,
      Boolean hidden, WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    WorkspaceMaterial workspaceMaterial = workspaceMaterialDAO.create(parent, material.getId(), title, urlName, index, hidden, assignmentType, correctAnswers);
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
    WorkspaceNode workspaceNode = findWorkspaceNodeByWorkspaceEntityAndPath(workspaceEntity, path); 
    return workspaceNode instanceof WorkspaceMaterial ? (WorkspaceMaterial) workspaceNode : null;
  }

  public List<WorkspaceMaterial> listWorkspaceMaterialsByParent(WorkspaceNode parent) {
    return workspaceMaterialDAO.listByParent(parent);
  }

  public List<WorkspaceMaterial> listWorkspaceMaterialsByMaterial(Material material) {
    return workspaceMaterialDAO.listByMaterialId(material.getId());
  }

  public WorkspaceMaterial updateWorkspaceMaterialAssignmentType(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialAssignmentType assignmentType) {
    return workspaceMaterialDAO.updateAssignmentType(workspaceMaterial, assignmentType);
  }
  
  public WorkspaceFolder updateWorkspaceFolder(WorkspaceFolder workspaceFolder, String title, WorkspaceNode parentNode, WorkspaceNode nextSibling, Boolean hidden) {
    if (nextSibling != null && !nextSibling.getParent().getId().equals(parentNode.getId())) {
      throw new IllegalArgumentException("Next sibling parent is not parent");
    }

    // Parent node & URL name
    
    long oldParent = workspaceFolder.getParent() == null ? 0 : workspaceFolder.getParent().getId();
    long newParent = parentNode == null ? 0 : parentNode.getId();
    if (oldParent != newParent) {
      // Before changing the parent, make sure the folder's URL name will be unique under it
      String urlName = generateUniqueUrlName(parentNode, title);
      // Change the parent
      workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateParent(workspaceFolder, parentNode);
      // Update URL name if applicable 
      if (!StringUtils.equals(workspaceFolder.getUrlName(), urlName)) {
        workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateUrlName(workspaceFolder, urlName);
      }
    }
    else {
      // Parent stays the same. Still, make sure title and URL name are in sync  
      String urlName = generateUniqueUrlName(parentNode, workspaceFolder, title);
      if (!StringUtils.equals(workspaceFolder.getUrlName(), urlName)) {
        workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateUrlName(workspaceFolder, urlName);
      }
    }
    
    // Next sibling
    
    if (nextSibling == null) {
      Integer orderNumber = workspaceNodeDAO.getMaximumOrderNumber(parentNode);
      orderNumber = orderNumber == null ? 0 : orderNumber;
      if (workspaceFolder.getOrderNumber() < orderNumber) {
        workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateOrderNumber(workspaceFolder, ++orderNumber);
      }
    } else {
      workspaceFolder = (WorkspaceFolder) moveAbove(workspaceFolder, nextSibling);
    }
    
    // Hidden
    
    workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateHidden(workspaceFolder, hidden);
    
    // Title
    
    String urlName = generateUniqueUrlName(workspaceFolder.getParent(), workspaceFolder, title);
    workspaceFolder = workspaceFolderDAO.updateFolderName(workspaceFolder, urlName, title);
    
    // Return updated folder
    
    return workspaceFolder;
  }

  public WorkspaceNode updateWorkspaceNode(WorkspaceNode workspaceNode, Long materialId, WorkspaceNode parentNode, WorkspaceNode nextSibling, Boolean hidden,
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers, String title) {
    if (nextSibling != null && !nextSibling.getParent().getId().equals(parentNode.getId())) {
      throw new IllegalArgumentException("Next sibling parent is not parent");
    }

    // Material id
    
    if (workspaceNode instanceof WorkspaceMaterial) {
      workspaceNode = workspaceMaterialDAO.updateMaterialId((WorkspaceMaterial) workspaceNode, materialId);
      workspaceNode = workspaceMaterialDAO.updateAssignmentType((WorkspaceMaterial) workspaceNode, assignmentType);
      workspaceNode = workspaceMaterialDAO.updateCorrectAnswers((WorkspaceMaterial) workspaceNode, correctAnswers);
    }
    
    // Title
    
    workspaceNode = workspaceNodeDAO.updateTitle(workspaceNode, title);
    
    // Parent node & URL name
    
    long oldParent = workspaceNode.getParent() == null ? 0 : workspaceNode.getParent().getId();
    long newParent = parentNode == null ? 0 : parentNode.getId();
    if (oldParent != newParent) {
      // Before changing the parent, make sure the node's URL name will be unique under it
      String urlName = generateUniqueUrlName(parentNode, title);
      // Change the parent
      workspaceNode = workspaceNodeDAO.updateParent(workspaceNode, parentNode);
      // Update URL name 
      workspaceNode = workspaceNodeDAO.updateUrlName(workspaceNode, urlName);
    }
    else {
      // Update URL name
      String urlName = generateUniqueUrlName(parentNode, workspaceNode, title);
      workspaceNode = workspaceNodeDAO.updateUrlName(workspaceNode, urlName);
    }
    
    // Next sibling
    
    if (nextSibling == null) {
      Integer orderNumber = workspaceNodeDAO.getMaximumOrderNumber(parentNode);
      orderNumber = orderNumber == null ? 0 : orderNumber;
      if (workspaceNode.getOrderNumber() < orderNumber) {
        workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, ++orderNumber);
      }
    } else {
      workspaceNode = moveAbove(workspaceNode, nextSibling);
    }

    // Hidden
    
    workspaceNode = workspaceNodeDAO.updateHidden(workspaceNode, hidden);

    // Updated node
    return workspaceNode;
  }

  public void showWorkspaceNode(WorkspaceNode workspaceNode) {
    workspaceNodeDAO.updateHidden(workspaceNode,  Boolean.TRUE);
  }

  public void hideWorkspaceNode(WorkspaceNode workspaceNode) {
    workspaceNodeDAO.updateHidden(workspaceNode,  Boolean.FALSE);
  }

  public void deleteWorkspaceMaterial(WorkspaceMaterial workspaceMaterial, boolean removeAnswers) throws WorkspaceMaterialContainsAnswersExeption {
    try {
      workspaceMaterialDeleteEvent.fire(new WorkspaceMaterialDeleteEvent(workspaceMaterial, removeAnswers));

      List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentSortByOrderNumber(workspaceMaterial);
      for (WorkspaceNode childNode : childNodes) {
        if (childNode instanceof WorkspaceMaterial) {
          deleteWorkspaceMaterial((WorkspaceMaterial) childNode, removeAnswers);
        } else if (childNode instanceof WorkspaceFolder) {
          deleteWorkspaceFolder((WorkspaceFolder) childNode);
        }
      }
    } catch (Exception e) {
      Throwable cause = e;
      while (e.getCause() != null) {
        cause = cause.getCause();
        if (cause instanceof WorkspaceMaterialContainsAnswersExeption) {
          throw (WorkspaceMaterialContainsAnswersExeption) cause;
        }
      }
      throw e;
    }

    workspaceMaterialDAO.delete(workspaceMaterial);
  }

  /**
   * Returns the identifier of the workspace entity the given workspace node belongs to.
   * 
   * @param workspaceNode
   *          The workspace node
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


  public void deleteWorkspaceRootFolder(WorkspaceRootFolder workspaceRootFolder) {
    workspaceRootFolderDAO.delete(workspaceRootFolder);
  }

  /* Folder */

  public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title, String urlName) {
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    return createWorkspaceFolder(parent, title, urlName, index, Boolean.FALSE, WorkspaceFolderType.DEFAULT);
  }
  
  public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title, String urlName, Integer index, Boolean hidden, WorkspaceFolderType folderType) {
    WorkspaceFolder workspaceFolder = workspaceFolderDAO.create(parent, title, urlName, index, hidden, folderType);
    workspaceFolderCreateEvent.fire(new WorkspaceFolderCreateEvent(workspaceFolder));
    return workspaceFolder;
  }

  public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title) {
    String urlName = generateUniqueUrlName(title);
    return createWorkspaceFolder(parent, title, urlName);
  }
  
  public WorkspaceMaterial ensureWorkspaceFrontPageExists(WorkspaceEntity workspace) {
    WorkspaceFolder frontPageFolder = findWorkspaceFrontPageFolder(workspace);
    if (frontPageFolder == null) {
      frontPageFolder = createWorkspaceFrontPageFolder(workspace);
    }
    WorkspaceMaterial frontPageMaterial = null;
    List<WorkspaceMaterial> frontPageMaterials = listWorkspaceMaterialsByParent(frontPageFolder);
    if (frontPageMaterials.isEmpty()) {
      String title = localeController.getText(sessionController.getLocale(), "plugin.workspace.frontPage.title");
      HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(title, "", "text/html", 0l);
      frontPageMaterial = createWorkspaceMaterial(frontPageFolder, htmlMaterial);
    }
    else {
      frontPageMaterial = frontPageMaterials.get(0);
    }
    return frontPageMaterial;
  }

  public WorkspaceMaterial ensureWorkspaceHelpPageExists(WorkspaceEntity workspace) {
    WorkspaceFolder helpPageFolder = findWorkspaceHelpPageFolder(workspace);
    if (helpPageFolder == null) {
      helpPageFolder = createWorkspaceHelpPageFolder(workspace);
    }
    WorkspaceMaterial helpPageMaterial = null;
    List<WorkspaceMaterial> helpPageMaterials = listWorkspaceMaterialsByParent(helpPageFolder);
    if (helpPageMaterials.isEmpty()) {
      String title = localeController.getText(sessionController.getLocale(), "plugin.workspace.helpPage.title");
      HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(title, "", "text/html", 0l);
      helpPageMaterial = createWorkspaceMaterial(helpPageFolder, htmlMaterial);
    }
    else {
      helpPageMaterial = helpPageMaterials.get(0);
    }
    return helpPageMaterial;
  }

  public WorkspaceFolder findWorkspaceFolderById(Long workspaceFolderId) {
    return workspaceFolderDAO.findById(workspaceFolderId);
  }

  public void deleteWorkspaceFolder(WorkspaceFolder workspaceFolder) {
    workspaceFolderDAO.delete(workspaceFolder);
  }
  
  public void updateDefaultMaterial(WorkspaceFolder workspaceFolder, WorkspaceNode defaultMaterial) {
    workspaceFolderDAO.updateDefaultMaterial(workspaceFolder, defaultMaterial);
  }

  /* Utility methods */
  
  public List<WorkspaceMaterial> listVisibleWorkspaceMaterialsByAssignmentType(WorkspaceEntity workspaceEntity, WorkspaceMaterialAssignmentType assignmentType) {
    final List<WorkspaceNode> folders = listVisibleWorkspaceFolders(workspaceEntity);
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialDAO.listByHiddenAndAssignmentTypeAndParents(Boolean.FALSE, assignmentType, folders);

    Collections.sort(workspaceMaterials, new Comparator<WorkspaceMaterial>() {
      
      @Override
      public int compare(WorkspaceMaterial o1, WorkspaceMaterial o2) {
        int result = getParentIndex(o1.getParent()) - getParentIndex(o2.getParent());
        if (result == 0) {
          result = o1.getOrderNumber().compareTo(o2.getOrderNumber());
        }
        
        return result;
      }
      
      private int getParentIndex(WorkspaceNode parent) {
        return folders.indexOf(parent);
      }
    });
    
    return workspaceMaterials;
  }

  public List<WorkspaceMaterial> listVisibleWorkspaceMaterialsByParentAndAssignmentType(WorkspaceNode parent, WorkspaceEntity workspaceEntity,
      WorkspaceMaterialAssignmentType assignmentType) {
    return workspaceMaterialDAO.listByHiddenAndAssignmentTypeAndParents(Boolean.FALSE, assignmentType, Arrays.asList(parent));
  }
  
  public List<ContentNode> listVisibleEvaluableWorkspaceMaterialsAsContentNodes(WorkspaceEntity workspaceEntity, boolean processHtml) throws WorkspaceMaterialException {
    List<ContentNode> result = new ArrayList<>();
    
    List<WorkspaceMaterial> workspaceMaterials = listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
    
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      result.add(createContentNode(workspaceMaterial, 0, processHtml, false));
    }
    
    return result;
  }

  private List<WorkspaceNode> listVisibleWorkspaceFolders(WorkspaceEntity workspaceEntity) {
    List<WorkspaceNode> result = new ArrayList<>();

    WorkspaceRootFolder rootFolder = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    result.add(rootFolder);
    
    appendVisibleChildFolders(rootFolder, result);

    return result;
  }
  
  private void appendVisibleChildFolders(WorkspaceNode parent, List<WorkspaceNode> result) {
    List<WorkspaceFolder> childFolders = workspaceFolderDAO.listByHiddenAndParentAndFolderType(Boolean.FALSE, parent, WorkspaceFolderType.DEFAULT);
    result.addAll(childFolders);
    
    for (WorkspaceFolder childFolder : childFolders) {
      appendVisibleChildFolders(childFolder, result);
    }
  }

  public List<FlattenedWorkspaceNode> flattenWorkspaceNodes(List<WorkspaceNode> workspaceNodes, int level, boolean includeHidden) {
    List<FlattenedWorkspaceNode> result = new ArrayList<>();

    for (WorkspaceNode workspaceNode : workspaceNodes) {
      if (workspaceNode.getType() == WorkspaceNodeType.FOLDER) {
        WorkspaceFolder workspaceFolder = (WorkspaceFolder) workspaceNode;
        List<WorkspaceNode> children = includeHidden
            ? workspaceNodeDAO.listByParentSortByOrderNumber(workspaceFolder)
            : workspaceNodeDAO.listByParentAndHiddenSortByOrderNumber(workspaceFolder, Boolean.FALSE);
        result.add(new FlattenedWorkspaceNode(true, workspaceFolder.getTitle(), null, level, workspaceFolder.getParent().getId(), workspaceFolder.getHidden()));
        result.addAll(flattenWorkspaceNodes(children, level + 1, includeHidden));
      } else {
        result.add(new FlattenedWorkspaceNode(false, null, workspaceNode, level, workspaceNode.getParent().getId(), workspaceNode.getHidden()));
      }
    }

    return result;
  }
  
  public List<ContentNode> listWorkspaceMaterialsAsContentNodes(WorkspaceEntity workspaceEntity, boolean includeHidden) throws WorkspaceMaterialException {
   List<ContentNode> contentNodes = new ArrayList<>();
   WorkspaceRootFolder rootFolder = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
   List<WorkspaceNode> rootMaterialNodes = includeHidden
       ? listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(rootFolder, WorkspaceFolderType.DEFAULT)
       : listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(rootFolder, WorkspaceFolderType.DEFAULT);
   for (WorkspaceNode rootMaterialNode : rootMaterialNodes) {
     ContentNode node = createContentNode(rootMaterialNode, 1, true, includeHidden);
     contentNodes.add(node);
   }
   return contentNodes;
  }

  public List<ContentNode> listWorkspaceFrontPagesAsContentNodes(WorkspaceEntity workspaceEntity) throws WorkspaceMaterialException {
    List<ContentNode> contentNodes = new ArrayList<>();
    List<WorkspaceMaterial> frontPages = listFrontPages(workspaceEntity);
    for (WorkspaceNode frontPage : frontPages) {
      ContentNode node = createContentNode(frontPage);
      contentNodes.add(node);
    }
    return contentNodes;
  }
  
  public List<ContentNode> listWorkspaceHelpPagesAsContentNodes(WorkspaceEntity workspaceEntity) throws WorkspaceMaterialException {
    List<ContentNode> contentNodes = new ArrayList<>();
    List<WorkspaceMaterial> helpPages = listHelpPages(workspaceEntity);
    for (WorkspaceMaterial helpPage : helpPages) {
      ContentNode node = createContentNode(helpPage);
      contentNodes.add(node);
    }
    return contentNodes;
  }

  public ContentNode createContentNode(WorkspaceNode rootMaterialNode) throws WorkspaceMaterialException {
    return createContentNode(rootMaterialNode, 1, true, true);
  }

  private ContentNode createContentNode(WorkspaceNode rootMaterialNode, int level, boolean processHtml, boolean includeHidden) throws WorkspaceMaterialException {
    try {
      switch (rootMaterialNode.getType()) {
      case FOLDER:
        WorkspaceFolder workspaceFolder = (WorkspaceFolder) rootMaterialNode;
        ContentNode folderContentNode = new ContentNode(workspaceFolder.getTitle(), "folder", rootMaterialNode.getId(), null, level, null, null, rootMaterialNode.getParent().getId(), rootMaterialNode.getHidden(), null, 0l, 0l, workspaceFolder.getPath());

        List<WorkspaceNode> children = includeHidden
            ? workspaceNodeDAO.listByParentSortByOrderNumber(workspaceFolder)
            : workspaceNodeDAO.listByParentAndHiddenSortByOrderNumber(workspaceFolder, Boolean.FALSE);
        List<FlattenedWorkspaceNode> flattenedChildren;
        if (level >= FLATTENING_LEVEL) {
          flattenedChildren = flattenWorkspaceNodes(children, level, includeHidden);
        }
        else {
          flattenedChildren = new ArrayList<>();
          for (WorkspaceNode node : children) {
            flattenedChildren.add(new FlattenedWorkspaceNode(false, null, node, level, node.getParent().getId(), node.getHidden()));
          }
        }
        for (FlattenedWorkspaceNode child : flattenedChildren) {
          ContentNode contentNode;
          if (child.isEmptyFolder) {
            contentNode = new ContentNode(child.emptyFolderTitle, "folder", rootMaterialNode.getId(), null, child.level, null, null, child.parentId, child.hidden, null, 0l, 0l, child.node.getPath());
          } else {
            contentNode = createContentNode(child.node, child.level, processHtml, includeHidden);
          }
          folderContentNode.addChild(contentNode);
        }

        return folderContentNode;
      case MATERIAL:
        DOMParser parser = null;
        Transformer transformer = null;
        
        if (processHtml) {
          parser = new DOMParser(new HTMLConfiguration());
          parser.setProperty("http://cyberneko.org/html/properties/names/elems", "lower");
          transformer = TransformerFactory.newInstance().newTransformer();
          transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
          transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
          transformer.setOutputProperty(OutputKeys.METHOD, "xml");
          transformer.setOutputProperty(OutputKeys.INDENT, "no");
        }
        
        WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) rootMaterialNode;
        Material material = materialController.findMaterialById(workspaceMaterial.getMaterialId());
        Long currentRevision = material instanceof HtmlMaterial ? htmlMaterialController.lastHtmlMaterialRevision((HtmlMaterial) material) : 0l;
        Long publishedRevision = material instanceof HtmlMaterial ? ((HtmlMaterial) material).getRevisionNumber() : 0l;
        return new ContentNode(workspaceMaterial.getTitle(), material.getType(), rootMaterialNode.getId(), material.getId(), level,
            workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getParent().getId(),
            workspaceMaterial.getHidden(), processHtml ? getMaterialHtml(material, parser, transformer) : null,
            currentRevision, publishedRevision, workspaceMaterial.getPath());
      default:
        return null;
      }
    }
    catch (SAXNotRecognizedException | SAXNotSupportedException | TransformerConfigurationException e) {
      throw new WorkspaceMaterialException(e); 
    }
  }

  private String getMaterialHtml(Material material, DOMParser parser, Transformer transformer) throws WorkspaceMaterialException {
    try {
      if (material instanceof HtmlMaterial) {
        String html = ((HtmlMaterial) material).getHtml();
        if (html == null) {
          return null;
        }

        StringReader htmlReader = new StringReader(html);
        try {
          InputSource inputSource = new InputSource(htmlReader);
          parser.parse(inputSource);
          Document document = parser.getDocument();
 
          NodeList imgList = document.getElementsByTagName("img");
          for (int i = 0, l = imgList.getLength(); i < l; i++) {
            Element img = (Element) imgList.item(i);
            String imgClass = img.getAttribute("class");
            img.setAttribute("class", imgClass == null ? "lazy" : imgClass + " lazy");
            img.setAttribute("data-original", img.getAttribute("src"));
            img.removeAttribute("src");
          }

          NodeList iframeList = document.getElementsByTagName("iframe");
          for (int i = iframeList.getLength() -1 ; i >= 0; i--) {
            Element iframe = (Element) iframeList.item(i);
            String src = iframe.getAttribute("src");
            if (StringUtils.contains(src, "youtube")) {
              String youtubeId = src.substring(src.lastIndexOf('/') + 1);
              iframe.removeAttribute("src");
              Element youtubeDiv = document.createElement("div");
              youtubeDiv.setAttribute("class", "js-lazyyt");
              youtubeDiv.setAttribute("data-youtube-id", youtubeId);
              youtubeDiv.setAttribute("data-ratio", "16:9");
              Node iframeParent = iframe.getParentNode();
              iframeParent.replaceChild(youtubeDiv, iframe);
            }
          }

          StringWriter writer = new StringWriter();
          NodeList bodyChildren = (NodeList) XPathFactory.newInstance().newXPath().evaluate("//body/*", document, XPathConstants.NODESET);
          for (int i = 0, l = bodyChildren.getLength(); i < l; i++) {
            transformer.transform(new DOMSource(bodyChildren.item(i)), new StreamResult(writer));
          }
          return writer.getBuffer().toString();
        } finally {
          htmlReader.close(); 
        }
      }

      return null;
    }
    catch (IOException | XPathExpressionException | TransformerException | SAXException e) {
      throw new WorkspaceMaterialException(e);
    }
  }

  public synchronized String generateUniqueUrlName(String title) {
    return generateUniqueUrlName(null, null, title);
  }

  public synchronized String generateUniqueUrlName(WorkspaceNode parent, String title) {
    return generateUniqueUrlName(parent, null, title);
  }

  public synchronized String generateUniqueUrlName(WorkspaceNode parent, WorkspaceNode targetNode, String title) {
    String urlName = generateUrlName(title);
    String fileName = StringUtils.substringBeforeLast(urlName, ".");
    String extension = StringUtils.substringAfterLast(urlName, ".");
    int extensionLength = StringUtils.length(extension); 
    boolean isFileName = StringUtils.isAlphanumeric(extension) && extensionLength < StringUtils.length(urlName) - 1;
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
          uniqueName = isFileName ? String.format("%s-%d.%s", fileName, ++i, extension) : String.format("%s-%d", urlName, ++i); 
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
    String urlName = title == null ? "" : StringUtils.lowerCase(title.replaceAll(" ", "-").replaceAll("/", "-"));
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus, period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return StringUtils.isBlank(urlName) ? StringUtils.substringBefore(UUID.randomUUID().toString(), "-") : urlName;
  }

  /* Front page */

  public WorkspaceFolder createWorkspaceHelpPageFolder(WorkspaceEntity workspaceEntity) {
    return workspaceFolderDAO.create(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), "Ohjeet", "ohjeet", 0, false, WorkspaceFolderType.HELP_PAGE);
  }

  public WorkspaceFolder createWorkspaceFrontPageFolder(WorkspaceEntity workspaceEntity) {
    return workspaceFolderDAO.create(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), "Etusivu", "etusivu", 0, false, WorkspaceFolderType.FRONT_PAGE);
  }

  private WorkspaceFolder findWorkspaceFrontPageFolder(WorkspaceEntity workspaceEntity) {
    List<WorkspaceFolder> frontPageFolders = workspaceFolderDAO.listByParentAndFolderType(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity),
        WorkspaceFolderType.FRONT_PAGE);
    if (frontPageFolders.isEmpty()) {
      return null;
    }
    if (frontPageFolders.size() > 1) {
      logger.warning("Workspace " + workspaceEntity.getId() + " has multiple front page folders");
    }
    return frontPageFolders.get(0);
  }

  private WorkspaceFolder findWorkspaceHelpPageFolder(WorkspaceEntity workspaceEntity) {
    List<WorkspaceFolder> helpPageFolders = workspaceFolderDAO.listByParentAndFolderType(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity),
        WorkspaceFolderType.HELP_PAGE);
    if (helpPageFolders.isEmpty()) {
      return null;
    }
    if (helpPageFolders.size() > 1) {
      logger.warning("Workspace " + workspaceEntity.getId() + " has multiple help page folders");
    }
    return helpPageFolders.get(0);
  }

  private List<WorkspaceMaterial> listFrontPages(WorkspaceEntity workspaceEntity) {
    WorkspaceFolder frontPageFolder = findWorkspaceFrontPageFolder(workspaceEntity);
    if (frontPageFolder != null) {
      return listWorkspaceMaterialsByParent(frontPageFolder);
    }
    return Arrays.asList();
  }

  private List<WorkspaceMaterial> listHelpPages(WorkspaceEntity workspaceEntity) {
    WorkspaceFolder helpPageFolder = findWorkspaceHelpPageFolder(workspaceEntity);
    if (helpPageFolder != null) {
      return listWorkspaceMaterialsByParent(helpPageFolder);
    }
    return Arrays.asList();
  }

  private static class FlattenedWorkspaceNode {

    public FlattenedWorkspaceNode(boolean isEmptyFolder, String emptyFolderTitle, WorkspaceNode node, int level, Long parentId, Boolean hidden) {
      this.isEmptyFolder = isEmptyFolder;
      this.emptyFolderTitle = emptyFolderTitle;
      this.node = node;
      this.level = level;
      this.parentId = parentId;
      this.hidden = hidden;
    }

    public final boolean isEmptyFolder;
    public final String emptyFolderTitle;
    public final WorkspaceNode node;
    public final int level;
    public final Long parentId;
    public final Boolean hidden;
  }

}
