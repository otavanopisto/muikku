package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NeverLoggedInNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NeverLoggedInNotification_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class NeverLoggedInNotificationDAO extends CorePluginsDAO<NeverLoggedInNotification> {

  private static final long serialVersionUID = -2984364208802922221L;

  public NeverLoggedInNotification create(String studentIdentifier, Date sent){
    NeverLoggedInNotification neverLoggedInNotification = new NeverLoggedInNotification();
    neverLoggedInNotification.setSent(sent);
    neverLoggedInNotification.setStudentIdentifier(studentIdentifier);
    return persist(neverLoggedInNotification);
  }

  
  public List<NeverLoggedInNotification> listByDateAfter(Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NeverLoggedInNotification> criteria = criteriaBuilder.createQuery(NeverLoggedInNotification.class);
    
    Root<NeverLoggedInNotification> root = criteria.from(NeverLoggedInNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.greaterThanOrEqualTo(root.get(NeverLoggedInNotification_.sent), sent));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public NeverLoggedInNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NeverLoggedInNotification> criteria = criteriaBuilder.createQuery(NeverLoggedInNotification.class);
    
    Root<NeverLoggedInNotification> root = criteria.from(NeverLoggedInNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(NeverLoggedInNotification_.studentIdentifier), identifier.toId()));
    criteria.orderBy(criteriaBuilder.desc(root.get(NeverLoggedInNotification_.sent)));
    
    TypedQuery<NeverLoggedInNotification> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }
  
}
