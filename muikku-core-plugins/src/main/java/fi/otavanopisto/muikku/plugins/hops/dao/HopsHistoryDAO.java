package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory;
import fi.otavanopisto.muikku.plugins.hops.model.HopsHistory_;

public class HopsHistoryDAO extends CorePluginsDAO<HopsHistory> {

  private static final long serialVersionUID = 684462720482086730L;

  public HopsHistory create(Long userEntityId, String category, Date date, String lastModifier, String details, String changes) {
    EntityManager entityManager = getEntityManager();
    
    HopsHistory hopsHistory = new HopsHistory();
    hopsHistory.setUserEntityId(userEntityId);
    hopsHistory.setCategory(category);
    hopsHistory.setDate(date);
    hopsHistory.setModifier(lastModifier);
    hopsHistory.setDetails(details);
    hopsHistory.setChanges(changes);
    
    entityManager.persist(hopsHistory);

    return hopsHistory;
  }
  
  public HopsHistory update(HopsHistory history, String details, String changes) {
    history.setDetails(details);
    history.setChanges(changes);
    return persist(history);
  }

  public List<HopsHistory> listByUserEntityIdAndCategory(Long userEntityId, String category, int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsHistory> criteria = criteriaBuilder.createQuery(HopsHistory.class);
    Root<HopsHistory> root = criteria.from(HopsHistory.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsHistory_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsHistory_.category), category)
      )
    );

    // Sort latest to oldest
    criteria.orderBy(criteriaBuilder.desc(root.get(HopsHistory_.date)));
    
    TypedQuery<HopsHistory> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);

    return query.getResultList();
  }

}
