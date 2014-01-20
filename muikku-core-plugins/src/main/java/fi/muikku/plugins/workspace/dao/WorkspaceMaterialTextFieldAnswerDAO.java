package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QueryTextField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer_;

public class WorkspaceMaterialTextFieldAnswerDAO extends PluginDAO<WorkspaceMaterialTextFieldAnswer> {
	
  private static final long serialVersionUID = 3744204546402170002L;

  public WorkspaceMaterialTextFieldAnswer create(QueryTextField queryField, WorkspaceMaterialReply reply, String value) {
		WorkspaceMaterialTextFieldAnswer workspaceMaterialTextFieldAnswer = new WorkspaceMaterialTextFieldAnswer();
		
		workspaceMaterialTextFieldAnswer.setQueryField(queryField);
		workspaceMaterialTextFieldAnswer.setReply(reply);
    workspaceMaterialTextFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialTextFieldAnswer);
	}

  public WorkspaceMaterialTextFieldAnswer findByQueryFieldAndReply(QueryTextField queryField, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialTextFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialTextFieldAnswer.class);
    Root<WorkspaceMaterialTextFieldAnswer> root = criteria.from(WorkspaceMaterialTextFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialTextFieldAnswer_.queryField), queryField),
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
