package fi.otavanopisto.muikku.plugins.evaluation.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.InterimEvaluationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.InterimEvaluationRequest_;

public class InterimEvaluationRequestDAO extends CorePluginsDAO<InterimEvaluationRequest> {

  private static final long serialVersionUID = -1631588583638989671L;

  public InterimEvaluationRequest createInterimEvaluationRequest(
      Long userEntityId,
      Long workspaceEntityId,
      Long workspaceMaterialId,
      Date requestDate,
      Date cancellationDate) {
    InterimEvaluationRequest interimEvaluationRequest = new InterimEvaluationRequest();
    
    interimEvaluationRequest.setUserEntityId(userEntityId);
    interimEvaluationRequest.setWorkspaceEntityId(workspaceEntityId);
    interimEvaluationRequest.setWorkspaceMaterialId(workspaceMaterialId);
    interimEvaluationRequest.setRequestDate(requestDate);
    interimEvaluationRequest.setCancellationDate(cancellationDate);
    interimEvaluationRequest.setArchived(Boolean.FALSE);
    
    return persist(interimEvaluationRequest);
  }

  public InterimEvaluationRequest updateInterimEvalutionRequest(
      InterimEvaluationRequest interimEvaluationRequest,
      Date cancellationDate,
      Boolean archived) {
    interimEvaluationRequest.setCancellationDate(cancellationDate);
    interimEvaluationRequest.setArchived(archived);
    
    return persist(interimEvaluationRequest);
  }
  
  public List<InterimEvaluationRequest> listByUserAndWorkspace(Long userEntityId, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InterimEvaluationRequest> criteria = criteriaBuilder.createQuery(InterimEvaluationRequest.class);
    Root<InterimEvaluationRequest> root = criteria.from(InterimEvaluationRequest.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.userEntityId), userEntityId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.workspaceEntityId), workspaceEntityId)
            )
        );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<InterimEvaluationRequest> listByUserAndWorkspaceAndArchived(Long userEntityId, Long workspaceEntityId, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InterimEvaluationRequest> criteria = criteriaBuilder.createQuery(InterimEvaluationRequest.class);
    Root<InterimEvaluationRequest> root = criteria.from(InterimEvaluationRequest.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.userEntityId), userEntityId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.workspaceEntityId), workspaceEntityId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.archived), archived)
            )
        );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<InterimEvaluationRequest> listByUserAndWorkspaceAndMaterialAndArchived(Long userEntityId, Long workspaceEntityId, Long workspaceMaterialId, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<InterimEvaluationRequest> criteria = criteriaBuilder.createQuery(InterimEvaluationRequest.class);
    Root<InterimEvaluationRequest> root = criteria.from(InterimEvaluationRequest.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.userEntityId), userEntityId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.workspaceEntityId), workspaceEntityId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.workspaceMaterialId), workspaceMaterialId),
            criteriaBuilder.equal(root.get(InterimEvaluationRequest_.archived), archived)
            )
        );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void archive(InterimEvaluationRequest interimEvaluationRequest) {
    interimEvaluationRequest.setArchived(Boolean.TRUE);
    getEntityManager().persist(interimEvaluationRequest);
  }

}
