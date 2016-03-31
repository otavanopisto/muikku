package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectFieldOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswerOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMaterialMultiSelectFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialMultiSelectFieldAnswer> {
	
  private static final long serialVersionUID = 8767283875784190142L;

  public WorkspaceMaterialMultiSelectFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
		WorkspaceMaterialMultiSelectFieldAnswer workspaceMaterialMultiSelectFieldAnswer = new WorkspaceMaterialMultiSelectFieldAnswer();
		
		workspaceMaterialMultiSelectFieldAnswer.setField(field);
		workspaceMaterialMultiSelectFieldAnswer.setReply(reply);
		
		return persist(workspaceMaterialMultiSelectFieldAnswer);
	}

  public WorkspaceMaterialMultiSelectFieldAnswer findByQueryFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialMultiSelectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialMultiSelectFieldAnswer.class);
    Root<WorkspaceMaterialMultiSelectFieldAnswer> root = criteria.from(WorkspaceMaterialMultiSelectFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceMaterialMultiSelectFieldAnswer> listByQueryMultiSelectFieldOption(QueryMultiSelectFieldOption option) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialMultiSelectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialMultiSelectFieldAnswer.class);
    Root<WorkspaceMaterialMultiSelectFieldAnswerOption> root = criteria.from(WorkspaceMaterialMultiSelectFieldAnswerOption.class);
    criteria.select(root.get(WorkspaceMaterialMultiSelectFieldAnswerOption_.fieldAnswer)).distinct(true);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialMultiSelectFieldAnswerOption_.option), option)
    );
    return entityManager.createQuery(criteria).getResultList();
  }

}
