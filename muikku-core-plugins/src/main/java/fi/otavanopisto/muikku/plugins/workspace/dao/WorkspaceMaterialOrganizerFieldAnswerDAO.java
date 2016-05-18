package fi.otavanopisto.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialOrganizerFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialOrganizerFieldAnswer_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMaterialOrganizerFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialOrganizerFieldAnswer> {
	
  private static final long serialVersionUID = -7592424516902940440L;

  public WorkspaceMaterialOrganizerFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) {
    WorkspaceMaterialOrganizerFieldAnswer workspaceMaterialOrganizerFieldAnswer = new WorkspaceMaterialOrganizerFieldAnswer();
		
    workspaceMaterialOrganizerFieldAnswer.setField(field);
    workspaceMaterialOrganizerFieldAnswer.setReply(reply);
    workspaceMaterialOrganizerFieldAnswer.setValue(value);
		
		return persist(workspaceMaterialOrganizerFieldAnswer);
	}

  public WorkspaceMaterialOrganizerFieldAnswer findByFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialOrganizerFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialOrganizerFieldAnswer.class);
    Root<WorkspaceMaterialOrganizerFieldAnswer> root = criteria.from(WorkspaceMaterialOrganizerFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialOrganizerFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialOrganizerFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public WorkspaceMaterialOrganizerFieldAnswer updateValue(WorkspaceMaterialOrganizerFieldAnswer workspaceMaterialOrganizerFieldAnswer, String value) {
    workspaceMaterialOrganizerFieldAnswer.setValue(value);
    return persist(workspaceMaterialOrganizerFieldAnswer);
  }
  
}
