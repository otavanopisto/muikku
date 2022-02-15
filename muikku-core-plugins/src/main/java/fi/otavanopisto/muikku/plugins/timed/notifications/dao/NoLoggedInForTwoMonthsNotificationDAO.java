package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoLoggedInForTwoMonthsNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoLoggedInForTwoMonthsNotification_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class NoLoggedInForTwoMonthsNotificationDAO extends CorePluginsDAO<NoLoggedInForTwoMonthsNotification> {

  private static final long serialVersionUID = -4635496717599349701L;

  public NoLoggedInForTwoMonthsNotification create(String studentIdentifier, Date sent){
    NoLoggedInForTwoMonthsNotification noLoggedInForTwoMonthsNotification = new NoLoggedInForTwoMonthsNotification();
    noLoggedInForTwoMonthsNotification.setSent(sent);
    noLoggedInForTwoMonthsNotification.setStudentIdentifier(studentIdentifier);
    return persist(noLoggedInForTwoMonthsNotification);
  }

  
  public List<NoLoggedInForTwoMonthsNotification> listByDateAfter(Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoLoggedInForTwoMonthsNotification> criteria = criteriaBuilder.createQuery(NoLoggedInForTwoMonthsNotification.class);
    
    Root<NoLoggedInForTwoMonthsNotification> root = criteria.from(NoLoggedInForTwoMonthsNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.greaterThanOrEqualTo(root.get(NoLoggedInForTwoMonthsNotification_.sent), sent));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public NoLoggedInForTwoMonthsNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoLoggedInForTwoMonthsNotification> criteria = criteriaBuilder.createQuery(NoLoggedInForTwoMonthsNotification.class);
    
    Root<NoLoggedInForTwoMonthsNotification> root = criteria.from(NoLoggedInForTwoMonthsNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(NoLoggedInForTwoMonthsNotification_.studentIdentifier), identifier.toId()));
    criteria.orderBy(criteriaBuilder.desc(root.get(NoLoggedInForTwoMonthsNotification_.sent)));
    
    TypedQuery<NoLoggedInForTwoMonthsNotification> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }
  
}
