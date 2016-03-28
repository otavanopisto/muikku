package fi.otavanopisto.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFileFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMaterialFileFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialFileFieldAnswer> {
	
  private static final long serialVersionUID = -9168361235642209288L;

  public WorkspaceMaterialFileFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
		WorkspaceMaterialFileFieldAnswer workspaceMaterialFileFieldAnswer = new WorkspaceMaterialFileFieldAnswer();
		
		workspaceMaterialFileFieldAnswer.setField(field);
		workspaceMaterialFileFieldAnswer.setReply(reply);
		
		return persist(workspaceMaterialFileFieldAnswer);
	}

  public WorkspaceMaterialFileFieldAnswer findByQueryFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialFileFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialFileFieldAnswer.class);
    Root<WorkspaceMaterialFileFieldAnswer> root = criteria.from(WorkspaceMaterialFileFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialFileFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialFileFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
