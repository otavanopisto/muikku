package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QuerySelectField;
import fi.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer_;

public class WorkspaceMaterialSelectFieldAnswerDAO extends PluginDAO<WorkspaceMaterialSelectFieldAnswer> {
	
  private static final long serialVersionUID = 3744204546402170002L;

  public WorkspaceMaterialSelectFieldAnswer create(QuerySelectField queryField, WorkspaceMaterialReply reply, QuerySelectFieldOption value) {
		WorkspaceMaterialSelectFieldAnswer workspaceMaterialSelectFieldAnswer = new WorkspaceMaterialSelectFieldAnswer();
		
		workspaceMaterialSelectFieldAnswer.setQueryField(queryField);
		workspaceMaterialSelectFieldAnswer.setReply(reply);
    workspaceMaterialSelectFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialSelectFieldAnswer);
	}

  public WorkspaceMaterialSelectFieldAnswer findByQueryFieldAndReply(QuerySelectField queryField, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialSelectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialSelectFieldAnswer.class);
    Root<WorkspaceMaterialSelectFieldAnswer> root = criteria.from(WorkspaceMaterialSelectFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialSelectFieldAnswer_.queryField), queryField),
        criteriaBuilder.equal(root.get(WorkspaceMaterialSelectFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public WorkspaceMaterialSelectFieldAnswer updateValue(WorkspaceMaterialSelectFieldAnswer workspaceMaterialSelectFieldAnswer, QuerySelectFieldOption value) {
    workspaceMaterialSelectFieldAnswer.setValue(value);
    return persist(workspaceMaterialSelectFieldAnswer);
  }
  
}
