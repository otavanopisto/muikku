package fi.otavanopisto.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceMaterialTextFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialTextFieldAnswer> {
	
  private static final long serialVersionUID = 3744204546402170002L;

  public WorkspaceMaterialTextFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
		WorkspaceMaterialTextFieldAnswer workspaceMaterialTextFieldAnswer = new WorkspaceMaterialTextFieldAnswer();
		
		workspaceMaterialTextFieldAnswer.setField(field);
		workspaceMaterialTextFieldAnswer.setReply(reply);
		workspaceMaterialTextFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialTextFieldAnswer);
	}

  public WorkspaceMaterialTextFieldAnswer findByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialTextFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialTextFieldAnswer.class);
    Root<WorkspaceMaterialTextFieldAnswer> root = criteria.from(WorkspaceMaterialTextFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialTextFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialTextFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public WorkspaceMaterialTextFieldAnswer updateValue(WorkspaceMaterialTextFieldAnswer workspaceMaterialTextFieldAnswer, String value) {
    workspaceMaterialTextFieldAnswer.setValue(value);
    return persist(workspaceMaterialTextFieldAnswer);
  }
  
}
