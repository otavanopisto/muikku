package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder_;
import fi.otavanopisto.muikku.model.base.BooleanPredicate;
import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.MaterialViewRestrict;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolderType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class WorkspaceFolderDAO extends CorePluginsDAO<WorkspaceFolder> {

  private static final long serialVersionUID = 9095130166469638314L;

  public WorkspaceFolder create(WorkspaceNode parent, String title, String urlName, Integer orderNumber, Boolean hidden, WorkspaceFolderType folderType, MaterialViewRestrict viewRestrict, WorkspaceLanguage language) {
    WorkspaceFolder workspaceFolder = new WorkspaceFolder();
    workspaceFolder.setParent(parent);
    workspaceFolder.setUrlName(urlName);
    workspaceFolder.setFolderType(folderType);
    workspaceFolder.setTitle(title);
    workspaceFolder.setOrderNumber(orderNumber);
    workspaceFolder.setHidden(hidden);
    workspaceFolder.setViewRestrict(viewRestrict);
    workspaceFolder.setLanguage(language);
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

  public List<WorkspaceFolder> listByParentAndFolderTypeAndExam(WorkspaceNode parent, WorkspaceFolderType folderType, boolean exam) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent),
            criteriaBuilder.equal(root.get(WorkspaceFolder_.folderType), folderType),
            criteriaBuilder.equal(root.get(WorkspaceFolder_.exam), exam)
         )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceFolder> listByHiddenAndParentAndFolderType(BooleanPredicate hidden, WorkspaceNode parent, WorkspaceFolderType folderType) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceFolder> criteria = criteriaBuilder.createQuery(WorkspaceFolder.class);
    Root<WorkspaceFolder> root = criteria.from(WorkspaceFolder.class);
    criteria.select(root);
    
    List<Predicate> predicates = new ArrayList<>();
    predicates.add(criteriaBuilder.equal(root.get(WorkspaceFolder_.parent), parent));
    predicates.add(criteriaBuilder.equal(root.get(WorkspaceFolder_.folderType), folderType));

    if (hidden != BooleanPredicate.IGNORE) {
      predicates.add(criteriaBuilder.equal(root.get(WorkspaceFolder_.hidden), hidden.asBoolean()));
    }
    
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

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
  
  public WorkspaceFolder updateViewRestrict(WorkspaceFolder workspaceFolder, MaterialViewRestrict viewRestrict) {
    workspaceFolder.setViewRestrict(viewRestrict);
    return persist(workspaceFolder); 
  }

  public WorkspaceFolder updateDefaultMaterial(WorkspaceFolder workspaceFolder, WorkspaceNode defaultMaterial) {
    workspaceFolder.setDefaultMaterial(defaultMaterial);
    return persist(workspaceFolder);
  }
  
  public WorkspaceFolder updateExam(WorkspaceFolder workspaceFolder, boolean exam) {
    workspaceFolder.setExam(exam);
    return persist(workspaceFolder);
  }

}
