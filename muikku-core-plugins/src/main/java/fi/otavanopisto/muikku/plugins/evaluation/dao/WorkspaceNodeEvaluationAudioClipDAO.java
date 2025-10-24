package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluationAudioClip_;

public class WorkspaceNodeEvaluationAudioClipDAO extends CorePluginsDAO<WorkspaceNodeEvaluationAudioClip> {

  private static final long serialVersionUID = 6267964480099212310L;

  public WorkspaceNodeEvaluationAudioClip create(WorkspaceNodeEvaluation evaluation, String contentType, String clipId, String fileName) {
    WorkspaceNodeEvaluationAudioClip clip = new WorkspaceNodeEvaluationAudioClip();

    clip.setEvaluation(evaluation);
    clip.setContentType(contentType);
    clip.setClipId(clipId);
    clip.setFileName(fileName);

    return persist(clip);
  }
  
  public WorkspaceNodeEvaluationAudioClip findByClipId(String clipId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluationAudioClip> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluationAudioClip.class);
    Root<WorkspaceNodeEvaluationAudioClip> root = criteria.from(WorkspaceNodeEvaluationAudioClip.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceNodeEvaluationAudioClip_.clipId), clipId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<WorkspaceNodeEvaluationAudioClip> listByEvaluation(WorkspaceNodeEvaluation evaluation) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNodeEvaluationAudioClip> criteria = criteriaBuilder.createQuery(WorkspaceNodeEvaluationAudioClip.class);
    Root<WorkspaceNodeEvaluationAudioClip> root = criteria.from(WorkspaceNodeEvaluationAudioClip.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceNodeEvaluationAudioClip_.evaluation), evaluation)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(WorkspaceNodeEvaluationAudioClip clip) {
    super.delete(clip);
  }
  
}
