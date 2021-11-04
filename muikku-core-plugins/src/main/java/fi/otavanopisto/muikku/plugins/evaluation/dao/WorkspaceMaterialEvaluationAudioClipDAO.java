package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationAudioClip_;

public class WorkspaceMaterialEvaluationAudioClipDAO extends CorePluginsDAO<WorkspaceMaterialEvaluationAudioClip> {

  private static final long serialVersionUID = 6267964480099212310L;

  public WorkspaceMaterialEvaluationAudioClip create(WorkspaceMaterialEvaluation evaluation, String contentType, String clipId, String fileName) {
    WorkspaceMaterialEvaluationAudioClip workspaceMaterialEvaluationAudioClip = new WorkspaceMaterialEvaluationAudioClip();

    workspaceMaterialEvaluationAudioClip.setEvaluation(evaluation);
    workspaceMaterialEvaluationAudioClip.setContentType(contentType);
    workspaceMaterialEvaluationAudioClip.setClipId(clipId);
    workspaceMaterialEvaluationAudioClip.setFileName(fileName);

    return persist(workspaceMaterialEvaluationAudioClip);
  }
  
  public WorkspaceMaterialEvaluationAudioClip findByClipId(String clipId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluationAudioClip> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluationAudioClip.class);
    Root<WorkspaceMaterialEvaluationAudioClip> root = criteria.from(WorkspaceMaterialEvaluationAudioClip.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluationAudioClip_.clipId), clipId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceMaterialEvaluationAudioClip> listByEvaluation(WorkspaceMaterialEvaluation evaluation) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialEvaluationAudioClip> criteria = criteriaBuilder.createQuery(WorkspaceMaterialEvaluationAudioClip.class);
    Root<WorkspaceMaterialEvaluationAudioClip> root = criteria.from(WorkspaceMaterialEvaluationAudioClip.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceMaterialEvaluationAudioClip_.evaluation), evaluation)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(WorkspaceMaterialEvaluationAudioClip workspaceMaterialEvaluationAudioClip) {
    super.delete(workspaceMaterialEvaluationAudioClip);
  }
  
}
