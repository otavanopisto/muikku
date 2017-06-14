package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest_;

public class SupplementationRequestDAO extends CorePluginsDAO<SupplementationRequest> {

  private static final long serialVersionUID = -7069799142177500546L;
  
  public SupplementationRequest createSupplementationRequest(
      Long userEntityId,
      Long studentEntityId,
      Long workspaceEntityId,
      Long workspaceMaterialId,
      Date requestDate,
      String requestText) {
    SupplementationRequest supplementationRequest = new SupplementationRequest();
    
    supplementationRequest.setUserEntityId(userEntityId);
    supplementationRequest.setStudentEntityId(studentEntityId);
    supplementationRequest.setWorkspaceEntityId(workspaceEntityId);
    supplementationRequest.setWorkspaceMaterialId(workspaceMaterialId);
    supplementationRequest.setRequestDate(requestDate);
    supplementationRequest.setRequestText(requestText);
    supplementationRequest.setArchived(Boolean.FALSE);
    
    return persist(supplementationRequest);
  }
  
  public SupplementationRequest updateSupplementationRequest(
      SupplementationRequest supplementationRequest,
      Long userEntityId,
      Long studentEntityId,
      Long workspaceEntityId,
      Long workspaceMaterialId,
      Date requestDate,
      String requestText,
      Boolean archived) {
    supplementationRequest.setUserEntityId(userEntityId);
    supplementationRequest.setStudentEntityId(studentEntityId);
    supplementationRequest.setWorkspaceEntityId(workspaceEntityId);
    supplementationRequest.setWorkspaceMaterialId(workspaceMaterialId);
    supplementationRequest.setRequestDate(requestDate);
    supplementationRequest.setRequestText(requestText);
    supplementationRequest.setArchived(archived);
    
    return persist(supplementationRequest);
  }
  
  public SupplementationRequest findByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceEntityId), workspaceEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public SupplementationRequest findByStudentAndWorkspaceAndArchived(Long studentEntityId, Long workspaceEntityId, Boolean archived) {
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
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public SupplementationRequest findByStudentAndWorkspaceMaterial(Long studentEntityId, Long workspaceMaterialId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceMaterialId), workspaceMaterialId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public SupplementationRequest findByStudentAndWorkspaceMaterialAndArchived(Long studentEntityId, Long workspaceMaterialId, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SupplementationRequest> criteria = criteriaBuilder.createQuery(SupplementationRequest.class);
    Root<SupplementationRequest> root = criteria.from(SupplementationRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SupplementationRequest_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.workspaceMaterialId), workspaceMaterialId),
        criteriaBuilder.equal(root.get(SupplementationRequest_.archived), archived)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void archive(SupplementationRequest supplementationRequest) {
    supplementationRequest.setArchived(Boolean.TRUE);
    getEntityManager().persist(supplementationRequest);
  }

}
