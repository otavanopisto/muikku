package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.material.QueryField;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterial;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialField;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;


public class WorkspaceMaterialFieldDAO extends CorePluginsDAO<WorkspaceMaterialField> {

  private static final long serialVersionUID = 6804548350145556078L;

  public WorkspaceMaterialField create(QueryField field, WorkspaceMaterial workspaceMaterial) {

    WorkspaceMaterialField workspaceMaterialField = new WorkspaceMaterialField();

    workspaceMaterialField.setWorkspaceMaterial(workspaceMaterial);
    workspaceMaterialField.setQueryField(field);

    return persist(workspaceMaterialField);
  }

  public WorkspaceMaterialField findByWorkspaceMaterialAndQueryField(WorkspaceMaterial workspaceMaterial, QueryField queryField) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialField> criteria = criteriaBuilder.createQuery(WorkspaceMaterialField.class);
    Root<WorkspaceMaterialField> root = criteria.from(WorkspaceMaterialField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialField_.workspaceMaterial), workspaceMaterial),
        criteriaBuilder.equal(root.get(WorkspaceMaterialField_.queryField), queryField)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));    
  }

  public List<WorkspaceMaterialField> listByWorkspaceMaterial(WorkspaceMaterial workspaceMaterial) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialField> criteria = criteriaBuilder.createQuery(WorkspaceMaterialField.class);
    Root<WorkspaceMaterialField> root = criteria.from(WorkspaceMaterialField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialField_.workspaceMaterial), workspaceMaterial)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceMaterialField> listByQueryField(QueryField queryField) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialField> criteria = criteriaBuilder.createQuery(WorkspaceMaterialField.class);
    Root<WorkspaceMaterialField> root = criteria.from(WorkspaceMaterialField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialField_.queryField), queryField)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceMaterialField workspaceMaterialField) {
    super.delete(workspaceMaterialField);
  }

}
