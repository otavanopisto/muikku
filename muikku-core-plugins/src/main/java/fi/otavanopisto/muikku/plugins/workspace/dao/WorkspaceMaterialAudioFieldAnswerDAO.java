package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceMaterialAudioFieldAnswerDAO extends CorePluginsDAO<WorkspaceMaterialAudioFieldAnswer> {

  private static final long serialVersionUID = -5596246811354509872L;

  public WorkspaceMaterialAudioFieldAnswer create(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
		WorkspaceMaterialAudioFieldAnswer workspaceMaterialAudioFieldAnswer = new WorkspaceMaterialAudioFieldAnswer();
		
		workspaceMaterialAudioFieldAnswer.setField(field);
		workspaceMaterialAudioFieldAnswer.setReply(reply);
		
		return persist(workspaceMaterialAudioFieldAnswer);
	}

  public WorkspaceMaterialAudioFieldAnswer findByQueryFieldAndReply(WorkspaceMaterialField field, WorkspaceMaterialReply reply) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialAudioFieldAnswer> criteria = criteriaBuilder.createQuery(WorkspaceMaterialAudioFieldAnswer.class);
    Root<WorkspaceMaterialAudioFieldAnswer> root = criteria.from(WorkspaceMaterialAudioFieldAnswer.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceMaterialAudioFieldAnswer_.field), field),
        criteriaBuilder.equal(root.get(WorkspaceMaterialAudioFieldAnswer_.reply), reply)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<Long> listIdsByLargerAndLimit(Long id, int count) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceMaterialAudioFieldAnswer> root = criteria.from(WorkspaceMaterialAudioFieldAnswer.class);
    criteria.select(root.get(WorkspaceMaterialAudioFieldAnswer_.id));
    criteria.where(
      criteriaBuilder.greaterThan(root.get(WorkspaceMaterialAudioFieldAnswer_.id), id)
    );
    criteria.orderBy(criteriaBuilder.asc(root.get(WorkspaceMaterialAudioFieldAnswer_.id)));
    TypedQuery<Long> query = entityManager.createQuery(criteria);
    query.setMaxResults(count);
    return query.getResultList();
  }

}
