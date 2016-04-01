package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;


public class WorkspaceMaterialFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialFieldAnswer> {

  private static final long serialVersionUID = 1715784837556723065L;

  public List<WorkspaceMaterialFieldAnswer> listByField(WorkspaceMaterialField field) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialFieldAnswer.class);
    Root<WorkspaceMaterialFieldAnswer> root = criteria.from(WorkspaceMaterialFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialFieldAnswer_.field), field)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceMaterialFieldAnswer workspaceMaterialFieldAnswer) {
    super.delete(workspaceMaterialFieldAnswer);
  }

}
