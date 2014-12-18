package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer_;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialMultiSelectFieldAnswer;

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
  
}
