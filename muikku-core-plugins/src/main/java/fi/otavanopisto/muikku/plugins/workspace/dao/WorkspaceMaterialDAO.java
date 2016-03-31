package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialCorrectAnswersDisplay;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;

public class WorkspaceMaterialDAO extends CorePluginsDAO<WorkspaceMaterial> {
	
	private static final long serialVersionUID = -1777382212388116832L;

  public WorkspaceMaterial create(WorkspaceNode parent, long materialId, String title, String urlName, Integer orderNumber,
      Boolean hidden, WorkspaceMaterialAssignmentType assignmentType, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {

    WorkspaceMaterial workspaceMaterial = new WorkspaceMaterial();
    workspaceMaterial.setParent(parent);
    workspaceMaterial.setMaterialId(materialId);
    workspaceMaterial.setUrlName(urlName);
    workspaceMaterial.setOrderNumber(orderNumber);
    workspaceMaterial.setHidden(hidden);
    workspaceMaterial.setAssignmentType(assignmentType);
    workspaceMaterial.setCorrectAnswers(correctAnswers);
    workspaceMaterial.setTitle(title);

    return persist(workspaceMaterial);
  }

	public List<WorkspaceMaterial> listByParent(WorkspaceNode parent) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.parent), parent)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceMaterial> listByHiddenAndAssignmentTypeAndParents(Boolean hidden, WorkspaceMaterialAssignmentType assignmentType, List<WorkspaceNode> parents) {
    if (parents == null || parents.isEmpty()) {
      return Collections.emptyList();
    }
     
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.hidden), hidden),
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.assignmentType), assignmentType),
        root.get(WorkspaceMaterial_.parent).in(parents)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

	public WorkspaceMaterial findByFolderAndUrlName(WorkspaceNode parent, String urlName) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
  		criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.parent), parent),
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.urlName), urlName)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

  public List<WorkspaceMaterial> listByMaterialId(long materialId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterial_.materialId), materialId)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceMaterial> listByParentAndAssignmentType(WorkspaceNode parent, WorkspaceMaterialAssignmentType assignmentType) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterial> criteria = criteriaBuilder.createQuery(WorkspaceMaterial.class);
    Root<WorkspaceMaterial> root = criteria.from(WorkspaceMaterial.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.assignmentType), assignmentType),
        criteriaBuilder.equal(root.get(WorkspaceMaterial_.parent), parent)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterial updateMaterialId(WorkspaceMaterial workspaceMaterial, long materialId) {
    workspaceMaterial.setMaterialId(materialId);
    return persist(workspaceMaterial);
  }

  public WorkspaceMaterial updateUrlName(WorkspaceMaterial workspaceMaterial, String urlName) {
    workspaceMaterial.setUrlName(urlName);
    return persist(workspaceMaterial);
  }
  
  public WorkspaceMaterial updateAssignmentType(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialAssignmentType assignmentType) {
    workspaceMaterial.setAssignmentType(assignmentType);
    return persist(workspaceMaterial);
  }

  public WorkspaceMaterial updateCorrectAnswers(WorkspaceMaterial workspaceMaterial, WorkspaceMaterialCorrectAnswersDisplay correctAnswers) {
    workspaceMaterial.setCorrectAnswers(correctAnswers);
    return persist(workspaceMaterial);
  }

	public void delete(WorkspaceMaterial workspaceMaterial) {
	  super.delete(workspaceMaterial);
	}
	
}
