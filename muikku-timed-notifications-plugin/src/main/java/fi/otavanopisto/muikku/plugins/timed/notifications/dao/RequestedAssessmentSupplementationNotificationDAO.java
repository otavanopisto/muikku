package fi.otavanopisto.muikku.plugins.timed.notifications.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.timed.notifications.model.RequestedAssessmentSupplementationNotification;
import fi.otavanopisto.muikku.plugins.timed.notifications.model.RequestedAssessmentSupplementationNotification_;

public class RequestedAssessmentSupplementationNotificationDAO extends TimedNotificationsDAO<RequestedAssessmentSupplementationNotification> {

  private static final long serialVersionUID = 4519683507666678144L;

  public RequestedAssessmentSupplementationNotification create(String studentIdentifier, String workspaceIdentifier){
    RequestedAssessmentSupplementationNotification requestedAssessmentSupplementationNotification = new RequestedAssessmentSupplementationNotification();
    requestedAssessmentSupplementationNotification.setStudentIdentifier(studentIdentifier);
    requestedAssessmentSupplementationNotification.setWorkspaceIdentifier(workspaceIdentifier);
    return persist(requestedAssessmentSupplementationNotification);
  }

  public Long countByStudentIdentifierAndWorkspaceIdentifier(String studentIdentifier, String workspaceIdentifier){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    
    Root<RequestedAssessmentSupplementationNotification> root = criteria.from(RequestedAssessmentSupplementationNotification.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(RequestedAssessmentSupplementationNotification_.studentIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(RequestedAssessmentSupplementationNotification_.workspaceIdentifier), workspaceIdentifier)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
}
