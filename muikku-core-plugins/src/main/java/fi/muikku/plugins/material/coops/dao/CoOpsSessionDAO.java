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
import fi.muikku.plugins.material.coops.model.File;

public class CoOpsSessionDAO extends CorePluginsDAO<CoOpsSession> {

  private static final long serialVersionUID = 6392770442072904041L;

  public CoOpsSession create(File file, String sessionId, CoOpsSessionType type, Long joinRevision, String algorithm, Boolean closed, Date accessed) {
    CoOpsSession coOpsSession = new CoOpsSession();

    coOpsSession.setAccessed(accessed);
    coOpsSession.setAlgorithm(algorithm);
    coOpsSession.setClosed(closed);
    coOpsSession.setFile(file);
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

  public List<CoOpsSession> listByFileAndClosed(File file, Boolean closed) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CoOpsSession> criteria = criteriaBuilder.createQuery(CoOpsSession.class);
    Root<CoOpsSession> root = criteria.from(CoOpsSession.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CoOpsSession_.file), file),
        criteriaBuilder.equal(root.get(CoOpsSession_.closed), closed)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
