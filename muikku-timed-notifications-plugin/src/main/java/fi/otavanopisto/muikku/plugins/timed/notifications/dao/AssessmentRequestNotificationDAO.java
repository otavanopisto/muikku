package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification_;

public class AssessmentRequestNotificationDAO extends TimedNotificationsDAO<AssesmentRequestNotification> {

  private static final long serialVersionUID = 9061903745760909935L;
  
  public AssesmentRequestNotification create(String studentIdentifier, Date sent){
    AssesmentRequestNotification assesmentRequestNotification = new AssesmentRequestNotification();
    assesmentRequestNotification.setSent(sent);
    assesmentRequestNotification.setStudentIdentifier(studentIdentifier);
    return persist(assesmentRequestNotification);
  }

  public List<AssesmentRequestNotification> listByStudentIdentifierAndDateAfter(String studentIdentifier, Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssesmentRequestNotification> criteria = criteriaBuilder.createQuery(AssesmentRequestNotification.class);
    
    Root<AssesmentRequestNotification> root = criteria.from(AssesmentRequestNotification.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AssesmentRequestNotification_.studentIdentifier), studentIdentifier),
        criteriaBuilder.greaterThanOrEqualTo(root.get(AssesmentRequestNotification_.sent), sent)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AssesmentRequestNotification> listByDateAfter(Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssesmentRequestNotification> criteria = criteriaBuilder.createQuery(AssesmentRequestNotification.class);
    
    Root<AssesmentRequestNotification> root = criteria.from(AssesmentRequestNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.greaterThanOrEqualTo(root.get(AssesmentRequestNotification_.sent), sent));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Long countByStudentIdentifierAndDateAfter(String studentIdentifier, Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    
    Root<AssesmentRequestNotification> root = criteria.from(AssesmentRequestNotification.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AssesmentRequestNotification_.studentIdentifier), studentIdentifier),
        criteriaBuilder.greaterThanOrEqualTo(root.get(AssesmentRequestNotification_.sent), sent)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
}
