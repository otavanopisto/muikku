package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.QuerySelectFieldOption;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialSelectFieldAnswer;

public class WorkspaceMaterialSelectFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialSelectFieldAnswer> {
	
  private static final long serialVersionUID = 3744204546402170002L;

  public WorkspaceMaterialSelectFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, QuerySelectFieldOption value) {
		WorkspaceMaterialSelectFieldAnswer workspaceMaterialSelectFieldAnswer = new WorkspaceMaterialSelectFieldAnswer();
		
		workspaceMaterialSelectFieldAnswer.setField(field);
		workspaceMaterialSelectFieldAnswer.setReply(reply);
    workspaceMaterialSelectFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialSelectFieldAnswer);
	}

  public WorkspaceMaterialSelectFieldAnswer findByQueryFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialSelectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialSelectFieldAnswer.class);
    Root<WorkspaceMaterialSelectFieldAnswer> root = criteria.from(WorkspaceMaterialSelectFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialSelectFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialSelectFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialSelectFieldAnswer> listByQuerySelectFieldOption(QuerySelectFieldOption option) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialSelectFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialSelectFieldAnswer.class);
    Root<WorkspaceMaterialSelectFieldAnswer> root = criteria.from(WorkspaceMaterialSelectFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialSelectFieldAnswer_.value), option)
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceMaterialSelectFieldAnswer updateValue(WorkspaceMaterialSelectFieldAnswer workspaceMaterialSelectFieldAnswer, QuerySelectFieldOption value) {
    workspaceMaterialSelectFieldAnswer.setValue(value);
    return persist(workspaceMaterialSelectFieldAnswer);
  }
  
}
