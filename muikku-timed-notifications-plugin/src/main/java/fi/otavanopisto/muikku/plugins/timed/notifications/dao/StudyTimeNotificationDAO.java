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
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification_;

public class StudyTimeNotificationDAO extends TimedNotificationsDAO<StudyTimeNotification> {

  private static final long serialVersionUID = -593949686229292112L;

  public StudyTimeNotification create(String studentIdentifier, Date sent){
    StudyTimeNotification studyTimeNotification = new StudyTimeNotification();
    studyTimeNotification.setSent(sent);
    studyTimeNotification.setStudentIdentifier(studentIdentifier);
    return persist(studyTimeNotification);
  }

  
  public List<StudyTimeNotification> listByDateAfter(Date sent){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudyTimeNotification> criteria = criteriaBuilder.createQuery(StudyTimeNotification.class);
    
    Root<StudyTimeNotification> root = criteria.from(StudyTimeNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.greaterThanOrEqualTo(root.get(StudyTimeNotification_.sent), sent));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
