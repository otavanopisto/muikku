package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SupplementationRequestDAO extends CorePluginsDAO<SupplementationRequest> {

  private static final long serialVersionUID = -7069799142177500546L;
  
  public SupplementationRequest createSupplementationRequest(
      Long userEntityId,
      Long studentEntityId,
      Long workspaceEntityId,
      SchoolDataIdentifier workspaceSubjectIdentifier,
      Date requestDate,
      String requestText) {
    SupplementationRequest supplementationRequest = new SupplementationRequest();
    
    supplementationRequest.setUserEntityId(userEntityId);
    supplementationRequest.setStudentEntityId(studentEntityId);
    supplementationRequest.setWorkspaceEntityId(workspaceEntityId);
    supplementationRequest.setWorkspaceSubjectIdentifier(workspaceSubjectIdentifier != null ? workspaceSubjectIdentifier.toId() : null);
    supplementationRequest.setRequestDate(requestDate);
    supplementationRequest.setRequestText(requestText);
    supplementationRequest.setHandled(Boolean.FALSE);
    supplementationRequest.setArchived(Boolean.FALSE);
    
    return persist(supplementationRequest);
  }
  
  public SupplementationRequest update(
      SupplementationRequest supplementationRequest,
      Long userEntityId,
      Long studentEntityId,
      Long workspaceEntityId,
      SchoolDataIdentifier workspaceSubjectIdentifier,
      Date requestDate,
      String requestText,
      Boolean archived) {
    supplementationRequest.setUserEntityId(userEntityId);
    supplementationRequest.setStudentEntityId(studentEntityId);
    supplementationRequest.setWorkspaceEntityId(workspaceEntityId);
    supplementationRequest.setWorkspaceSubjectIdentifier(workspaceSubjectIdentifier != null ? workspaceSubjectIdentifier.toId() : null);
    supplementationRequest.setRequestDate(requestDate);
    supplementationRequest.setRequestText(requestText);
    supplementationRequest.setArchived(archived);
    
    return persist(supplementationRequest);
  }

  public SupplementationRequest updateHandled(SupplementationRequest supplementationRequest, boolean handled) {
    supplementationRequest.setHandled(handled);
    return persist(supplementationRequest);
  }
  
  public SupplementationRequest findLatestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    List<SupplementationRequest> requests = listByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, archived);
    if (requests.isEmpty()) {
      return null;
    }
    else if (requests.size() > 1) {
      requests.sort(Comparator.comparing(SupplementationRequest::getRequestDate).reversed());
    }
    return requests.get(0);
  }

  public SupplementationRequest findLatestByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, SchoolDataIdentifier workspaceSubjectIdentifier, Boolean archived) {
    List<SupplementationRequest> requests = listByStudentAndWorkspaceAndArchived(studentEntityId, workspaceEntityId, workspaceSubjectIdentifier, archived);
    if (requests.isEmpty()) {
      return null;
    }
    else if (requests.size() > 1) {
      requests.sort(Comparator.comparing(SupplementationRequest::getRequestDate).reversed());
    }
    return requests.get(0);
  }

  public List<SupplementationRequest> listByWorkspaceAndHandledAndArchived(Long workspaceEntityId, Boolean handled, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.handled), handled),
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<SupplementationRequest> listByStudentAndWorkspaceAndHandledAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean handled, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.handled), handled),
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<SupplementationRequest> listByStudentAndWorkspaceAndSubjectAndHandledAndArchived(Long studentEntityId, Long workspaceEntityId, String subject, Boolean handled, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.handled), handled),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceSubjectIdentifier), subject),
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<SupplementationRequest> listByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  /**
   * Returns a SupplementationRequest that matches given parameters. Due to backwards compatibility (pre WorkspaceSubject)
   * returns also SuppplementationRequests that may have null workspaceSubjectIdentifier.
   */
  public List<SupplementationRequest> listByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, SchoolDataIdentifier workspaceSubjectIdentifier, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);

    // If workspaceSubjectIdentifier is null, restrict to SupplementationRequests that have null workspaceSubjectIdentifier
    // else return SupplementationRequests that match the subjectIdentifier or have null identifier (for backwards compatibility)
    Predicate workspaceSubjectPredicate = workspaceSubjectIdentifier == null
        ? criteriaBuilder.isNull(root.get(SupplementationRequest_.workspaceSubjectIdentifier))
        : criteriaBuilder.or(
              criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceSubjectIdentifier), workspaceSubjectIdentifier.toId()),
              criteriaBuilder.isNull(root.get(SupplementationRequest_.workspaceSubjectIdentifier))
          );
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId),
        workspaceSubjectPredicate,
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void archive(SupplementationRequest supplementationRequest) {
    supplementationRequest.setArchived(Boolean.TRUE);
    getEntityManager().persist(supplementationRequest);
  }

}
