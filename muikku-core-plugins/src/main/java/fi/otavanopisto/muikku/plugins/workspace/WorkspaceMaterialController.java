package fi.otavanopisto.muikku.plugins.workspace;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.BooleanPredicate;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.material.model.MaterialProducer;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceNodeDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceRootFolderDAO;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceFolderCreateEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceFolderUpdateEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceMaterialCreateEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceMaterialDeleteEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceMaterialUpdateEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceRootFolderCreateEvent;
import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceRootFolderUpdateEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;

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
   * Updates the order numbers of workspace nodes so that
   * <code>workspaceNode</code> appears above <code>referenceNode</code>.
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
    // node order number = referenceOrderNumber, subsequent nodes =
    // ++referenceOrderNumber
    workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, referenceOrderNumber);
    for (WorkspaceNode subsequentNode : subsequentNodes) {
      if (!(subsequentNode.getId().equals(workspaceNode.getId()))) {
        workspaceNodeDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
      }
    }
    return workspaceNode;
  }

  /**
   * Updates the order numbers of workspace nodes so that
   * <code>workspaceNode</code> appears below <code>referenceNode</code>.
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
    // node order number = referenceOrderNumber + 1, subsequent nodes =
    // ++referenceOrderNumber
    workspaceNode = workspaceNodeDAO.updateOrderNumber(workspaceNode, ++referenceOrderNumber);
    for (WorkspaceNode subsequentNode : subsequentNodes) {
      workspaceNodeDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
    }
    return workspaceNode;
  }

  public WorkspaceNode findWorkspaceNodeNextSibling(WorkspaceNode referenceNode) {
    List<WorkspaceNode> nextSiblings = workspaceNodeDAO
        .listParentByOrderNumberGreaterSortByGreater(referenceNode.getParent(), referenceNode.getOrderNumber(), 0, 1);
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
    return String.format("workspace/%s/materials/%s", getWorkspaceNodeWorkspaceUrlName(workspaceNode),
        workspaceNode.getPath());
  }

  public WorkspaceMaterial findWorkspaceMaterialByRootPath(String path) {
    if (path.contains("?")) {
      path = StringUtils.substringBefore(path, "?");
    }
    String[] pathElements = StringUtils.split(path, "/");
    if (pathElements.length >= 3 && StringUtils.equals("workspace", pathElements[0])
        && StringUtils.equals("materials", pathElements[2])) {
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

  public List<WorkspaceNode> listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent,
      WorkspaceFolderType folderType) {
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

  public List<WorkspaceFolder> listWorkspaceFoldersByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent,
      WorkspaceFolderType folderType) {
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

  public List<WorkspaceNode> listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(WorkspaceNode parent,
      WorkspaceFolderType folderType) {
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
    deleteChildNodesAndSelf(rootFolder);
  }
  
  private void deleteChildNodesAndSelf(WorkspaceNode node) {
    List<WorkspaceNode> childNodes = listWorkspaceNodesByParent(node);
    for (WorkspaceNode childNode : childNodes) {
      deleteChildNodesAndSelf(childNode);
    }
    switch (node.getType()) {
    case FRONT_PAGE_FOLDER:
    case FOLDER:
      deleteWorkspaceFolder((WorkspaceFolder) node);
      break;
    case MATERIAL:
      try {
        deleteWorkspaceMaterial((WorkspaceMaterial) node, true);
      }
      catch (WorkspaceMaterialContainsAnswersExeption e) {
        // Ignored since removeAnswers flag has been explicitly set to true
      }
      break;
    case ROOT_FOLDER:
      deleteWorkspaceRootFolder((WorkspaceRootFolder) node);
      break;
    }
  }

  public Material getMaterialForWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    return workspaceMaterial.getMaterialId() == null ? null
        : materialController.findMaterialById(workspaceMaterial.getMaterialId());
  }

  public WorkspaceNode cloneWorkspaceNode(WorkspaceNode workspaceNode, WorkspaceNode parent, boolean cloneMaterials) {
    return cloneWorkspaceNode(workspaceNode, parent, cloneMaterials, false);
  }

  private WorkspaceNode cloneWorkspaceNode(WorkspaceNode workspaceNode, WorkspaceNode parent, boolean cloneMaterials,
      boolean overrideCloneMaterials) {
    WorkspaceNode newNode;
    boolean isHtmlMaterial = false;
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    if (workspaceNode instanceof WorkspaceMaterial) {
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) workspaceNode;
      Material material = getMaterialForWorkspaceMaterial(workspaceMaterial);
      isHtmlMaterial = material instanceof HtmlMaterial;
      Material clonedMaterial = cloneMaterials && !overrideCloneMaterials ? materialController.cloneMaterial(material)
          : material;

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

      newNode = createWorkspaceMaterial(parent, clonedMaterial, workspaceMaterial.getTitle(),
          generateUniqueUrlName(parent, workspaceMaterial.getUrlName()), index, workspaceMaterial.getHidden(),
          workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers());
    }
    else if (workspaceNode instanceof WorkspaceFolder) {
      WorkspaceFolder folder = (WorkspaceFolder) workspaceNode;
      // When copying front page or help page folders and the target already has them, remove
      // the existing ones first since all workspaces should only have one set 
      if (folder.getFolderType() == WorkspaceFolderType.FRONT_PAGE || folder.getFolderType() == WorkspaceFolderType.HELP_PAGE) {
        WorkspaceEntity workspaceEntity = findWorkspaceEntityByNode(parent);
        WorkspaceNode existingFolder = folder.getFolderType() == WorkspaceFolderType.FRONT_PAGE ?
            findWorkspaceFrontPageFolder(workspaceEntity) :
            findWorkspaceHelpPageFolder(workspaceEntity);
        if (existingFolder != null && !(existingFolder.getId().equals(folder.getId()))) {
          deleteChildNodesAndSelf(existingFolder);
        }
      }
      newNode = createWorkspaceFolder(parent, folder.getTitle(),
          generateUniqueUrlName(parent, workspaceNode.getUrlName()), index, workspaceNode.getHidden(),
          folder.getFolderType(), folder.getViewRestrict());
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
      String urlName = generateUniqueUrlName(workspaceMaterial.getParent(), workspaceMaterial,
          originMaterial.getTitle());
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

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material,
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    String urlName = generateUniqueUrlName(parent, material.getTitle());
    return createWorkspaceMaterial(parent, material, urlName, assignmentType, correctAnswers);
  }

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String urlName,
      WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    Integer index = workspaceNodeDAO.getMaximumOrderNumber(parent);
    index = index == null ? 0 : ++index;
    return createWorkspaceMaterial(parent, material, material.getTitle(), urlName, index, false, assignmentType,
        correctAnswers);
  }

  public WorkspaceMaterial createWorkspaceMaterial(WorkspaceNode parent, Material material, String title,
      String urlName, Integer index, Boolean hidden, WorkspaceMaterialAssignmentType assignmentType,
      WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    // #4927: If binary material filename has changed due to unique constraints,
    // update workspace instance filename accordingly
    if (material instanceof BinaryMaterial) {
      String oldFileName = generateUniqueUrlName(material.getTitle());
      if (!StringUtils.equals(oldFileName, urlName)) {
        title = urlName;
      }
    }
    WorkspaceMaterial workspaceMaterial = workspaceMaterialDAO.create(parent, material.getId(), title, urlName, index,
        hidden, assignmentType, correctAnswers);
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

  public WorkspaceMaterial updateWorkspaceMaterialAssignmentType(WorkspaceMaterial workspaceMaterial,
      WorkspaceMaterialAssignmentType assignmentType) {
    return workspaceMaterialDAO.updateAssignmentType(workspaceMaterial, assignmentType);
  }

  public WorkspaceFolder updateWorkspaceFolder(WorkspaceFolder workspaceFolder, String title, WorkspaceNode parentNode,
      WorkspaceNode nextSibling, Boolean hidden, MaterialViewRestrict viewRestrict) {
    if (nextSibling != null && !nextSibling.getParent().getId().equals(parentNode.getId())) {
      throw new IllegalArgumentException("Next sibling parent is not parent");
    }

    // Parent node & URL name

    long oldParent = workspaceFolder.getParent() == null ? 0 : workspaceFolder.getParent().getId();
    long newParent = parentNode == null ? 0 : parentNode.getId();
    if (oldParent != newParent) {
      // Before changing the parent, make sure the folder's URL name will be unique
      // under it
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
    }
    else {
      workspaceFolder = (WorkspaceFolder) moveAbove(workspaceFolder, nextSibling);
    }

    // Hidden

    workspaceFolder = (WorkspaceFolder) workspaceNodeDAO.updateHidden(workspaceFolder, hidden);

    // Title

    String urlName = generateUniqueUrlName(workspaceFolder.getParent(), workspaceFolder, title);
    workspaceFolder = workspaceFolderDAO.updateFolderName(workspaceFolder, urlName, title);

    // View restrict

    workspaceFolder = workspaceFolderDAO.updateViewRestrict(workspaceFolder, viewRestrict);

    // Return updated folder

    return workspaceFolder;
  }

  public WorkspaceNode updateWorkspaceNode(WorkspaceNode workspaceNode, Long materialId, WorkspaceNode parentNode,
      WorkspaceNode nextSibling, Boolean hidden, WorkspaceMaterialAssignmentType assignmentType,
      WorkspaceMaterialCorrectAnswersDisplay correctAnswers, String title) {
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
      // Before changing the parent, make sure the node's URL name will be unique
      // under it
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
    }
    else {
      workspaceNode = moveAbove(workspaceNode, nextSibling);
    }

    // Hidden

    workspaceNode = workspaceNodeDAO.updateHidden(workspaceNode, hidden);

    // Updated node
    return workspaceNode;
  }

  public void showWorkspaceNode(WorkspaceNode workspaceNode) {
    workspaceNodeDAO.updateHidden(workspaceNode, Boolean.TRUE);
  }

  public void hideWorkspaceNode(WorkspaceNode workspaceNode) {
    workspaceNodeDAO.updateHidden(workspaceNode, Boolean.FALSE);
  }

  public void deleteWorkspaceMaterial(WorkspaceMaterial workspaceMaterial, boolean removeAnswers)
      throws WorkspaceMaterialContainsAnswersExeption {
    try {
      workspaceMaterialDeleteEvent.fire(new WorkspaceMaterialDeleteEvent(workspaceMaterial, removeAnswers));

      List<WorkspaceNode> childNodes = workspaceNodeDAO.listByParentSortByOrderNumber(workspaceMaterial);
      for (WorkspaceNode childNode : childNodes) {
        if (childNode instanceof WorkspaceMaterial) {
          deleteWorkspaceMaterial((WorkspaceMaterial) childNode, removeAnswers);
        }
        else if (childNode instanceof WorkspaceFolder) {
          deleteWorkspaceFolder((WorkspaceFolder) childNode);
        }
      }
    }
    catch (Exception e) {
      Throwable cause = e;
      while (cause != null) {
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
   * Returns the identifier of the workspace entity the given workspace node
   * belongs to.
   * 
   * @param workspaceNode
   *          The workspace node
   * 
   * @return The identifier of the workspace entity the given workspace node
   *         belongs to
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
  
  public WorkspaceEntity findWorkspaceEntityByNode(WorkspaceNode node) {
    return workspaceEntityController.findWorkspaceEntityById(getWorkspaceEntityId(node));
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
    return createWorkspaceFolder(parent, title, urlName, index, Boolean.FALSE, WorkspaceFolderType.DEFAULT,
        MaterialViewRestrict.NONE);
  }

  public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title, String urlName, Integer index,
      Boolean hidden, WorkspaceFolderType folderType, MaterialViewRestrict viewRestrict) {
    WorkspaceFolder workspaceFolder = workspaceFolderDAO.create(parent, title, urlName, index, hidden, folderType,
        viewRestrict);
    workspaceFolderCreateEvent.fire(new WorkspaceFolderCreateEvent(workspaceFolder));
    return workspaceFolder;
  }

  public WorkspaceFolder createWorkspaceFolder(WorkspaceNode parent, String title) {
    String urlName = generateUniqueUrlName(parent, title);
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
      String license = null;
      HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(title, "", "text/html", 0l, license);
      frontPageMaterial = createWorkspaceMaterial(frontPageFolder, htmlMaterial);
    }
    else {
      frontPageMaterial = frontPageMaterials.get(0);
    }
    return frontPageMaterial;
  }

  public WorkspaceFolder ensureWorkspaceHelpFolderExists(WorkspaceEntity workspace) {
    WorkspaceFolder helpPageFolder = findWorkspaceHelpPageFolder(workspace);
    if (helpPageFolder == null) {
      helpPageFolder = createWorkspaceHelpPageFolder(workspace);
    }
    return helpPageFolder;
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

  public Long getMaterialCountByWorkspaceAndAssignmentType(WorkspaceEntity workspaceEntity,
      WorkspaceMaterialAssignmentType assignmentType) {
    List<WorkspaceNode> folders = listWorkspaceFolders(workspaceEntity, BooleanPredicate.FALSE);
    return workspaceMaterialDAO.countByHiddenAndAssignmentTypeAndParents(Boolean.FALSE, assignmentType, folders);
  }

  public List<WorkspaceMaterial> listVisibleWorkspaceMaterialsByAssignmentType(WorkspaceEntity workspaceEntity,
      WorkspaceMaterialAssignmentType assignmentType) {
    return listWorkspaceMaterialsByAssignmentType(workspaceEntity, assignmentType, BooleanPredicate.FALSE);
  }

  public List<WorkspaceMaterial> listWorkspaceMaterialsByAssignmentType(WorkspaceEntity workspaceEntity,
      WorkspaceMaterialAssignmentType assignmentType, BooleanPredicate hidden) {
    final List<WorkspaceNode> folders = listWorkspaceFolders(workspaceEntity, hidden);
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialDAO.listByHiddenAndAssignmentTypeAndParents(hidden,
        assignmentType, folders);
    Collections.sort(workspaceMaterials, new Comparator<WorkspaceMaterial>() {
      @Override
      public int compare(WorkspaceMaterial o1, WorkspaceMaterial o2) {
        int result = o1.getParent().getOrderNumber() - o2.getParent().getOrderNumber();
        if (result == 0) {
          result = o1.getOrderNumber().compareTo(o2.getOrderNumber());
        }
        return result;
      }
    });
    return workspaceMaterials;
  }

  public List<WorkspaceMaterial> listWorkspaceMaterialsByParentAndAssignmentType(WorkspaceNode parent,
      WorkspaceEntity workspaceEntity, WorkspaceMaterialAssignmentType assignmentType, BooleanPredicate hidden) {
    return workspaceMaterialDAO.listByHiddenAndAssignmentTypeAndParents(hidden, assignmentType, Arrays.asList(parent));
  }

  public List<ContentNode> listVisibleEvaluableWorkspaceMaterialsAsContentNodes(WorkspaceEntity workspaceEntity)
      throws WorkspaceMaterialException {
    List<ContentNode> result = new ArrayList<>();

    List<WorkspaceMaterial> workspaceMaterials = listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity,
        WorkspaceMaterialAssignmentType.EVALUATED);

    for (int i = 0; i < workspaceMaterials.size(); i++) {
      WorkspaceMaterial currentMaterial = workspaceMaterials.get(i);
      WorkspaceMaterial nextSibling = i + 1 < workspaceMaterials.size() ? workspaceMaterials.get(i + 1) : null;
      result.add(createContentNode(currentMaterial, 0, false, nextSibling));
    }

    return result;
  }

  private List<WorkspaceNode> listWorkspaceFolders(WorkspaceEntity workspaceEntity, BooleanPredicate hidden) {
    List<WorkspaceNode> result = new ArrayList<>();

    WorkspaceRootFolder rootFolder = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    result.add(rootFolder);

    appendChildFolders(rootFolder, result, hidden);

    return result;
  }

  private void appendChildFolders(WorkspaceNode parent, List<WorkspaceNode> result, BooleanPredicate hidden) {
    List<WorkspaceFolder> childFolders = workspaceFolderDAO.listByHiddenAndParentAndFolderType(hidden, parent,
        WorkspaceFolderType.DEFAULT);
    result.addAll(childFolders);

    for (WorkspaceFolder childFolder : childFolders) {
      appendChildFolders(childFolder, result, hidden);
    }
  }

  public List<FlattenedWorkspaceNode> flattenWorkspaceNodes(List<WorkspaceNode> workspaceNodes, int level,
      boolean includeHidden) {
    List<FlattenedWorkspaceNode> result = new ArrayList<>();

    for (int i = 0; i < workspaceNodes.size(); i++) {
      WorkspaceNode workspaceNode = workspaceNodes.get(i);
      WorkspaceNode nextSibling = i + 1 < workspaceNodes.size() ? workspaceNodes.get(i + 1) : null;
      if (workspaceNode.getType() == WorkspaceNodeType.FOLDER) {
        WorkspaceFolder workspaceFolder = (WorkspaceFolder) workspaceNode;
        List<WorkspaceNode> children = includeHidden ? workspaceNodeDAO.listByParentSortByOrderNumber(workspaceFolder)
            : workspaceNodeDAO.listByParentAndHiddenSortByOrderNumber(workspaceFolder, Boolean.FALSE);
        result.add(new FlattenedWorkspaceNode(true, workspaceFolder.getTitle(), workspaceFolder, level,
            workspaceFolder.getParent().getId(), nextSibling, workspaceFolder.getHidden()));
        result.addAll(flattenWorkspaceNodes(children, level + 1, includeHidden));
      }
      else {
        result.add(new FlattenedWorkspaceNode(false, null, workspaceNode, level, workspaceNode.getParent().getId(),
            nextSibling, workspaceNode.getHidden()));
      }
    }

    return result;
  }

  public List<ContentNode> listWorkspaceMaterialsAsContentNodes(WorkspaceEntity workspaceEntity, boolean includeHidden)
      throws WorkspaceMaterialException {
    List<ContentNode> contentNodes = new ArrayList<>();
    WorkspaceRootFolder rootFolder = findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
    List<WorkspaceNode> rootMaterialNodes = includeHidden
        ? listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(rootFolder, WorkspaceFolderType.DEFAULT)
        : listVisibleWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(rootFolder, WorkspaceFolderType.DEFAULT);
    for (int i = 0; i < rootMaterialNodes.size(); i++) {
      WorkspaceNode currentNode = rootMaterialNodes.get(i);
      WorkspaceNode nextSibling = i + 1 < rootMaterialNodes.size() ? rootMaterialNodes.get(i + 1) : null;
      ContentNode node = createContentNode(currentNode, 1, includeHidden, nextSibling);
      contentNodes.add(node);
    }
    return contentNodes;
  }

  public List<ContentNode> listWorkspaceFrontPagesAsContentNodes(WorkspaceEntity workspaceEntity)
      throws WorkspaceMaterialException {
    List<ContentNode> contentNodes = new ArrayList<>();
    List<WorkspaceMaterial> frontPages = listFrontPages(workspaceEntity);
    for (WorkspaceNode frontPage : frontPages) {
      ContentNode node = createContentNode(frontPage, null);
      contentNodes.add(node);
    }
    return contentNodes;
  }

  public List<ContentNode> listWorkspaceHelpPagesAsContentNodes(WorkspaceEntity workspaceEntity)
      throws WorkspaceMaterialException {
    List<ContentNode> contentNodes = new ArrayList<>();
    List<WorkspaceNode> helpPages = listHelpPages(workspaceEntity);
    for (int i = 0; i < helpPages.size(); i++) {
      WorkspaceNode currentNode = helpPages.get(i);
      WorkspaceNode nextSibling = i + 1 < helpPages.size() ? helpPages.get(i + 1) : null;
      ContentNode node = createContentNode(currentNode, 1, true, nextSibling);
      contentNodes.add(node);
    }
    return contentNodes;
  }

  public ContentNode createContentNode(WorkspaceNode rootMaterialNode, WorkspaceNode nextSibling)
      throws WorkspaceMaterialException {
    return createContentNode(rootMaterialNode, 1, true, nextSibling);
  }

  private ContentNode createContentNode(WorkspaceNode rootMaterialNode, int level, boolean includeHidden,
      WorkspaceNode nextSibling) throws WorkspaceMaterialException {
    boolean viewRestricted = false;
    switch (rootMaterialNode.getType()) {
    case FOLDER:
      WorkspaceFolder workspaceFolder = (WorkspaceFolder) rootMaterialNode;
      ContentNode folderContentNode = new ContentNode(workspaceFolder.getTitle(), "folder", null,
          rootMaterialNode.getId(), null, level, null, null, rootMaterialNode.getParent().getId(),
          nextSibling == null ? null : nextSibling.getId(), rootMaterialNode.getHidden(), null, 0l, 0l,
          workspaceFolder.getPath(), null, Collections.emptyList(), workspaceFolder.getViewRestrict());
      List<WorkspaceNode> children = includeHidden ? workspaceNodeDAO.listByParentSortByOrderNumber(workspaceFolder)
          : workspaceNodeDAO.listByParentAndHiddenSortByOrderNumber(workspaceFolder, Boolean.FALSE);
      List<FlattenedWorkspaceNode> flattenedChildren;
      if (level >= FLATTENING_LEVEL) {
        flattenedChildren = flattenWorkspaceNodes(children, level, includeHidden);
      }
      else {
        flattenedChildren = new ArrayList<>();
        for (WorkspaceNode node : children) {
          WorkspaceNode nextSibiling = findWorkspaceNodeNextSibling(node);
          flattenedChildren.add(new FlattenedWorkspaceNode(false, null, node, level, node.getParent().getId(),
              nextSibiling, node.getHidden()));
        }
      }
      for (FlattenedWorkspaceNode child : flattenedChildren) {
        ContentNode contentNode;
        if (child.isEmptyFolder) {
          contentNode = new ContentNode(child.emptyFolderTitle, "folder", null, rootMaterialNode.getId(), null,
              child.level, null, null, child.parentId, child.nextSibling == null ? null : child.nextSibling.getId(),
              child.hidden, null, 0l, 0l, child.node.getPath(), null, Collections.emptyList(),
              MaterialViewRestrict.NONE);
        }
        else {
          contentNode = createContentNode(child.node, child.level, includeHidden, child.nextSibling);
        }
        folderContentNode.addChild(contentNode);
      }

      return folderContentNode;
    case MATERIAL:
      WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) rootMaterialNode;
      Material material = materialController.findMaterialById(workspaceMaterial.getMaterialId());
      Long currentRevision = material instanceof HtmlMaterial ? ((HtmlMaterial) material).getRevisionNumber() : 0l;
      Long publishedRevision = material instanceof HtmlMaterial ? ((HtmlMaterial) material).getRevisionNumber() : 0l;
      String contentType = material instanceof HtmlMaterial ? ((HtmlMaterial) material).getContentType()
          : material instanceof BinaryMaterial ? ((BinaryMaterial) material).getContentType() : null;

      String html;
      viewRestricted = !sessionController.isLoggedIn() && material.getViewRestrict() == MaterialViewRestrict.LOGGED_IN;
      if (!viewRestricted) {
        html = material instanceof HtmlMaterial ? ((HtmlMaterial) material).getHtml() : null;
      }
      else {
        html = String.format("<p class=\"content-view-restricted-message\">%s</p>",
            localeController.getText(sessionController.getLocale(), "plugin.workspace.materialViewRestricted"));
      }

      nextSibling = findWorkspaceNodeNextSibling(workspaceMaterial);

      return new ContentNode(workspaceMaterial.getTitle(), material.getType(), contentType, rootMaterialNode.getId(),
          material.getId(), level, workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(),
          workspaceMaterial.getParent().getId(), nextSibling == null ? null : nextSibling.getId(),
          workspaceMaterial.getHidden(), html, currentRevision, publishedRevision, workspaceMaterial.getPath(),
          material.getLicense(), createRestModel(materialController.listMaterialProducers(material)), material.getViewRestrict());
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
    String urlName = generateUrlName(title);
    String fileName = StringUtils.substringBeforeLast(urlName, ".");
    String extension = StringUtils.substringAfterLast(urlName, ".");
    int extensionLength = StringUtils.length(extension);
    boolean isFileName = StringUtils.isAlphanumeric(extension) && extensionLength < StringUtils.length(urlName) - 1;
    // use urlName as base and uniqueName as final result
    String uniqueName = urlName;
    if (parent != null) {
      // if parent node is given, ensure that the generated url name is unique amongst
      // its child nodes
      int i = 1;
      while (true) {
        // find child node with uniqueName
        WorkspaceNode workspaceNode = workspaceNodeDAO.findByParentAndUrlName(parent, uniqueName);
        if (workspaceNode != null) {
          if (targetNode != null && workspaceNode.getId().equals(targetNode.getId())) {
            // uniqueName is in use but by the target node itself, so it's okay
            break;
          }
          // uniqueName in use, try again with the next candidate (name, name-2, name-3,
          // etc.)
          uniqueName = isFileName ? String.format("%s-%d.%s", fileName, ++i, extension)
              : String.format("%s-%d", urlName, ++i);
        }
        else {
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
    // get rid of accented characters and all special characters other than minus,
    // period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return StringUtils.isBlank(urlName) ? StringUtils.substringBefore(UUID.randomUUID().toString(), "-") : urlName;
  }

  /* Front page */

  public WorkspaceFolder createWorkspaceHelpPageFolder(WorkspaceEntity workspaceEntity) {
    return workspaceFolderDAO.create(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), "Ohjeet", "ohjeet", 0,
        false, WorkspaceFolderType.HELP_PAGE, MaterialViewRestrict.NONE);
  }

  public WorkspaceFolder createWorkspaceFrontPageFolder(WorkspaceEntity workspaceEntity) {
    return workspaceFolderDAO.create(findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), "Etusivu", "etusivu", 0,
        false, WorkspaceFolderType.FRONT_PAGE, MaterialViewRestrict.NONE);
  }

  public boolean isUsedInPublishedWorkspaces(Material material) {
    List<WorkspaceMaterial> workspaceMaterials = listWorkspaceMaterialsByMaterial(material);
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      WorkspaceEntity workspaceEntity = workspaceEntityController
          .findWorkspaceEntityById(getWorkspaceEntityId(workspaceMaterial));
      if (workspaceEntity != null && workspaceEntity.getPublished()) {
        return true;
      }
    }
    return false;
  }

  private WorkspaceFolder findWorkspaceFrontPageFolder(WorkspaceEntity workspaceEntity) {
    List<WorkspaceFolder> frontPageFolders = workspaceFolderDAO.listByParentAndFolderType(
        findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), WorkspaceFolderType.FRONT_PAGE);
    if (frontPageFolders.isEmpty()) {
      return null;
    }
    if (frontPageFolders.size() > 1) {
      logger.warning("Workspace " + workspaceEntity.getId() + " has multiple front page folders");
    }
    return frontPageFolders.get(0);
  }

  private WorkspaceFolder findWorkspaceHelpPageFolder(WorkspaceEntity workspaceEntity) {
    List<WorkspaceFolder> helpPageFolders = workspaceFolderDAO.listByParentAndFolderType(
        findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity), WorkspaceFolderType.HELP_PAGE);
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

  private List<WorkspaceNode> listHelpPages(WorkspaceEntity workspaceEntity) {
    WorkspaceFolder helpPageFolder = findWorkspaceHelpPageFolder(workspaceEntity);
    if (helpPageFolder != null) {
      return listWorkspaceNodesByParentAndFolderTypeSortByOrderNumber(helpPageFolder, WorkspaceFolderType.DEFAULT);
    }
    return Arrays.asList();
  }

  // TODO: This class should be oblivious to REST but ContentNode, in essence, is supposed to be a REST model  
  private List<fi.otavanopisto.muikku.plugins.material.rest.MaterialProducer> createRestModel(List<MaterialProducer> producers) {
    List<fi.otavanopisto.muikku.plugins.material.rest.MaterialProducer> result = new ArrayList<>();
    
    for (MaterialProducer producer : producers) {
      result.add(createRestModel(producer));
    }
    
    return result;
  }
  
  // TODO: This class should be oblivious to REST but ContentNode, in essence, is supposed to be a REST model  
  private fi.otavanopisto.muikku.plugins.material.rest.MaterialProducer createRestModel(MaterialProducer entity) {
    Long materialId = entity.getMaterial() != null ? entity.getMaterial().getId() : null;
    return new fi.otavanopisto.muikku.plugins.material.rest.MaterialProducer(entity.getId(), entity.getName(), materialId);
  } 

  private static class FlattenedWorkspaceNode {

    public FlattenedWorkspaceNode(boolean isEmptyFolder, String emptyFolderTitle, WorkspaceNode node, int level,
        Long parentId, WorkspaceNode nextSibling, Boolean hidden) {
      this.isEmptyFolder = isEmptyFolder;
      this.emptyFolderTitle = emptyFolderTitle;
      this.node = node;
      this.level = level;
      this.parentId = parentId;
      this.nextSibling = nextSibling;
      this.hidden = hidden;
    }

    public final boolean isEmptyFolder;
    public final String emptyFolderTitle;
    public final WorkspaceNode node;
    public final int level;
    public final Long parentId;
    public final WorkspaceNode nextSibling;
    public final Boolean hidden;
  }

}
