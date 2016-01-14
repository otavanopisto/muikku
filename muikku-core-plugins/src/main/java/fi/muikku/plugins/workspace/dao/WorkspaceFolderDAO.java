package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.muikku.plugins.workspace.model.WorkspaceFolder_;
import fi.muikku.plugins.workspace.model.WorkspaceNode;

public class WorkspaceFolderDAO extends CorePluginsDAO<WorkspaceFolder> {

  private static final long serialVersionUID = 9095130166469638314L;

  public WorkspaceFolder create(WorkspaceNode parent, String title, String urlName, Integer orderNumber, Boolean hidden, WorkspaceFolderType folderType) {
    WorkspaceFolder workspaceFolder = new WorkspaceFolder();
    workspaceFolder.setParent(parent);
    workspaceFolder.setUrlName(urlName);
    workspaceFolder.setFolderType(folderType);
    workspaceFolder.setTitle(title);
    workspaceFolder.setOrderNumber(orderNumber);
    workspaceFolder.setHidden(hidden);
    return persist(workspaceFolder);
  }

  public List<WorkspaceFolder> listByParentAndFolderType(WorkspaceNode parent, WorkspaceFolderType folderType) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent),
            criteriaBuilder.equal(root.get(WorkspaceFolder_.folderType), folderType)
         )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceFolder> listByHiddenAndParentAndFolderType(Boolean hidden, WorkspaceNode parent, WorkspaceFolderType folderType) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceFolder_.hidden), hidden),
            criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent),
            criteriaBuilder.equal(root.get(WorkspaceFolder_.folderType), folderType)
         )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceFolder workspaceFolder) {
    super.delete(workspaceFolder);
  }
  
  public WorkspaceFolder updateFolderName(WorkspaceFolder workspaceFolder, String urlName, String title) {
    workspaceFolder.setUrlName(urlName);
    workspaceFolder.setTitle(title);
    return persist(workspaceFolder); 
  }
  
  public WorkspaceFolder updateDefaultMaterial(WorkspaceFolder workspaceFolder, WorkspaceNode defaultMaterial) {
    workspaceFolder.setDefaultMaterial(defaultMaterial);
    return persist(workspaceFolder);
  }

}
