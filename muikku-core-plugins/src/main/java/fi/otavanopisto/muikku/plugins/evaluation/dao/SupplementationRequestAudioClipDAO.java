package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequestAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequestAudioClip_;

public class SupplementationRequestAudioClipDAO extends CorePluginsDAO<SupplementationRequestAudioClip> {

  private static final long serialVersionUID = -451297824686822633L;

  public SupplementationRequestAudioClip create(SupplementationRequest supplementationRequest, String contentType, String clipId, String fileName) {
    SupplementationRequestAudioClip supplementationAudioClip = new SupplementationRequestAudioClip();

    supplementationAudioClip.setSupplementationRequest(supplementationRequest);
    supplementationAudioClip.setContentType(contentType);
    supplementationAudioClip.setClipId(clipId);
    supplementationAudioClip.setFileName(fileName);

    return persist(supplementationAudioClip);
  }
  
  public SupplementationRequestAudioClip findByClipId(String clipId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequestAudioClip> criteria = criteriaBuilder.createQuery(SupplementationRequestAudioClip.class);
    Root<SupplementationRequestAudioClip> root = criteria.from(SupplementationRequestAudioClip.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(SupplementationRequestAudioClip_.clipId), clipId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<SupplementationRequestAudioClip> listBySupplementationRequest(SupplementationRequest supplementationRequest) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequestAudioClip> criteria = criteriaBuilder.createQuery(SupplementationRequestAudioClip.class);
    Root<SupplementationRequestAudioClip> root = criteria.from(SupplementationRequestAudioClip.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(SupplementationRequestAudioClip_.supplementationRequest), supplementationRequest)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(SupplementationRequestAudioClip supplementationRequestAudioClip) {
    super.delete(supplementationRequestAudioClip);
  }
  
}
