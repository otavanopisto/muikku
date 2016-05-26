package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialOrganizerFieldAnswer_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSorterFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSorterFieldAnswer_;

public class WorkspaceMaterialSorterFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialSorterFieldAnswer> {
	
  private static final long serialVersionUID = 1984922833954027686L;

  public WorkspaceMaterialSorterFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    WorkspaceMaterialSorterFieldAnswer workspaceMaterialSorterFieldAnswer = new WorkspaceMaterialSorterFieldAnswer();
		
    workspaceMaterialSorterFieldAnswer.setField(field);
    workspaceMaterialSorterFieldAnswer.setReply(reply);
    workspaceMaterialSorterFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialSorterFieldAnswer);
	}

  public WorkspaceMaterialSorterFieldAnswer findByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialSorterFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialSorterFieldAnswer.class);
    Root<WorkspaceMaterialSorterFieldAnswer> root = criteria.from(WorkspaceMaterialSorterFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialSorterFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialSorterFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceMaterialSorterFieldAnswer> listByWorkspaceMaterialField(WorkspaceMaterialField field) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialSorterFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialSorterFieldAnswer.class);
    Root<WorkspaceMaterialSorterFieldAnswer> root = criteria.from(WorkspaceMaterialSorterFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialOrganizerFieldAnswer_.field), field)
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialSorterFieldAnswer updateValue(WorkspaceMaterialSorterFieldAnswer workspaceMaterialSorterFieldAnswer, String value) {
    workspaceMaterialSorterFieldAnswer.setValue(value);
    return persist(workspaceMaterialSorterFieldAnswer);
  }
  
}
