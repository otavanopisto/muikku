package fi.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.QueryConnectFieldCounterpart;
import fi.muikku.plugins.material.model.QueryConnectFieldTerm;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer;
import fi.muikku.plugins.workspace.model.WorkspaceMaterialConnectFieldAnswer_;

public class WorkspaceMaterialConnectFieldAnswerDAO extends PluginDAO<WorkspaceMaterialConnectFieldAnswer> {
	
  private static final long serialVersionUID = -3185631042207642800L;

  public WorkspaceMaterialConnectFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QueryConnectFieldTerm term, QueryConnectFieldCounterpart counterpart) {
		WorkspaceMaterialConnectFieldAnswer workspaceMaterialConectFieldAnswer = new WorkspaceMaterialConnectFieldAnswer();
		
		workspaceMaterialConectFieldAnswer.setField(field);
		workspaceMaterialConectFieldAnswer.setReply(reply);
    workspaceMaterialConectFieldAnswer.setTerm(term);
    workspaceMaterialConectFieldAnswer.setCounterpart(counterpart);
		
		return persist(workspaceMaterialConectFieldAnswer);
	}

  public WorkspaceMaterialConnectFieldAnswer findByQueryFieldAndReplyAndTerm(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QueryConnectFieldTerm term) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialConnectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialConnectFieldAnswer.class);
    Root<WorkspaceMaterialConnectFieldAnswer> root = criteria.from(WorkspaceMaterialConnectFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialConnectFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialConnectFieldAnswer_.reply), reply),
        criteriaBuilder.equal(root.get(WorkspaceMaterialConnectFieldAnswer_.term), term)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public WorkspaceMaterialConnectFieldAnswer updateCounterpart(WorkspaceMaterialConnectFieldAnswer workspaceMaterialConnectFieldAnswer, QueryConnectFieldCounterpart counterpart) {
    workspaceMaterialConnectFieldAnswer.setCounterpart(counterpart);
    return persist(workspaceMaterialConnectFieldAnswer);
  }
  
}
