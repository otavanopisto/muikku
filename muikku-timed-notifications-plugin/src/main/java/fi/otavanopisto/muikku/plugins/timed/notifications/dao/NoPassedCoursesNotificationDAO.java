package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.AssesmentRequestNotification_;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.NoPassedCoursesNotification_;

public class NoPassedCoursesNotificationDAO extends TimedNotificationsDAO<NoPassedCoursesNotification> {

  private static final long serialVersionUID = -593949686229292112L;

  public NoPassedCoursesNotification create(String studentIdentifier, Date sent){
    NoPassedCoursesNotification noPassedCoursesNotification = new NoPassedCoursesNotification();
    noPassedCoursesNotification.setSent(sent);
    noPassedCoursesNotification.setStudentIdentifier(studentIdentifier);
    return persist(noPassedCoursesNotification);
  }

  
  public List<NoPassedCoursesNotification> listByDateAfter(Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoPassedCoursesNotification> criteria = criteriaBuilder.createQuery(NoPassedCoursesNotification.class);
    
    Root<NoPassedCoursesNotification> root = criteria.from(NoPassedCoursesNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.greaterThanOrEqualTo(root.get(NoPassedCoursesNotification_.sent), sent));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
