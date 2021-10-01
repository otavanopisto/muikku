package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.StudyTimeNotification_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class StudyTimeNotificationDAO extends CorePluginsDAO<StudyTimeNotification> {

  private static final long serialVersionUID = -2428496475608264591L;

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

  public StudyTimeNotification findLatestByUserIdentifier(SchoolDataIdentifier identifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudyTimeNotification> criteria = criteriaBuilder.createQuery(StudyTimeNotification.class);
    
    Root<StudyTimeNotification> root = criteria.from(StudyTimeNotification.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(StudyTimeNotification_.studentIdentifier), identifier.toId()));
    criteria.orderBy(criteriaBuilder.desc(root.get(StudyTimeNotification_.sent)));
    
    TypedQuery<StudyTimeNotification> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }
  
}
