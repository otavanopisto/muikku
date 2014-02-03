package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialChecklistFieldAnswer_;

public class WorkspaceMaterialChecklistFieldAnswerDAO extends PluginDAO<WorkspaceMaterialChecklistFieldAnswer> {
	
  private static final long serialVersionUID = 8767283875784190142L;

  public WorkspaceMaterialChecklistFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QuerySelectFieldOption value) {
		WorkspaceMaterialChecklistFieldAnswer workspaceMaterialChecklistFieldAnswer = new WorkspaceMaterialChecklistFieldAnswer();
		
		workspaceMaterialChecklistFieldAnswer.setField(field);
		workspaceMaterialChecklistFieldAnswer.setReply(reply);
		
		return persist(workspaceMaterialChecklistFieldAnswer);
	}

  public WorkspaceMaterialChecklistFieldAnswer findByQueryFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialChecklistFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialChecklistFieldAnswer.class);
    Root<WorkspaceMaterialChecklistFieldAnswer> root = criteria.from(WorkspaceMaterialChecklistFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialChecklistFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialChecklistFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
