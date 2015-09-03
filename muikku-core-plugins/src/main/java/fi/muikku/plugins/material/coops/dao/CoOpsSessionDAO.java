package fi.muikku.plugins.material.coops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.CoOpsSession;
import fi.muikku.plugins.material.coops.model.CoOpsSessionType;
import fi.muikku.plugins.material.coops.model.CoOpsSession_;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class CoOpsSessionDAO extends CorePluginsDAO<CoOpsSession> {

  private static final long serialVersionUID = 6392770442072904041L;

  public CoOpsSession create(HtmlMaterial htmlMaterial, Long userEntityId, String sessionId, CoOpsSessionType type, Long joinRevision, String algorithm, Boolean closed, Date accessed) {
    CoOpsSession coOpsSession = new CoOpsSession();

    coOpsSession.setAccessed(accessed);
    coOpsSession.setAlgorithm(algorithm);
    coOpsSession.setClosed(closed);
    coOpsSession.setHtmlMaterial(htmlMaterial);
    coOpsSession.setUserEntityId(userEntityId);
    coOpsSession.setJoinRevision(joinRevision);
    coOpsSession.setSessionId(sessionId);
    coOpsSession.setType(type);

    return persist(coOpsSession);
  }

  public CoOpsSession findBySessionId(String sessionId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CoOpsSession> criteria = criteriaBuilder.createQuery(CoOpsSession.class);
    Root<CoOpsSession> root = criteria.from(CoOpsSession.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CoOpsSession_.sessionId), sessionId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<CoOpsSession> listByFileAndClosed(HtmlMaterial htmlMaterial, Boolean closed) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CoOpsSession> criteria = criteriaBuilder.createQuery(CoOpsSession.class);
    Root<CoOpsSession> root = criteria.from(CoOpsSession.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CoOpsSession_.htmlMaterial), htmlMaterial),
        criteriaBuilder.equal(root.get(CoOpsSession_.closed), closed)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public CoOpsSession updateType(CoOpsSession coOpsSession, CoOpsSessionType type) {
    coOpsSession.setType(type);
    return persist(coOpsSession);
  }

  public CoOpsSession updateClosed(CoOpsSession session, Boolean closed) {
    session.setClosed(closed);
    return persist(session);
  }
  
  public List<CoOpsSession> listByAccessedBeforeAndTypeAndClosed(Date accessed, CoOpsSessionType type, Boolean closed) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CoOpsSession> criteria = criteriaBuilder.createQuery(CoOpsSession.class);
    Root<CoOpsSession> root = criteria.from(CoOpsSession.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CoOpsSession_.closed), closed),
        criteriaBuilder.equal(root.get(CoOpsSession_.type), type),
        criteriaBuilder.lessThan(root.get(CoOpsSession_.accessed), accessed)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<CoOpsSession> listByClosed(Boolean closed) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CoOpsSession> criteria = criteriaBuilder.createQuery(CoOpsSession.class);
    Root<CoOpsSession> root = criteria.from(CoOpsSession.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CoOpsSession_.closed), closed)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(CoOpsSession e) {
    super.delete(e);
  }

}
