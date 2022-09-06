package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.AssessmentRequestCancellation;
import fi.otavanopisto.muikku.plugins.evaluation.model.AssessmentRequestCancellation_;

public class AssessmentRequestCancellationDAO extends CorePluginsDAO<AssessmentRequestCancellation> {

  private static final long serialVersionUID = -7775042780336827575L;

  public AssessmentRequestCancellation createAssessmentRequestCancellation(
      Long studentEntityId,
      Long workspaceEntityId,
      Date cancellationDate
      ) {
    AssessmentRequestCancellation assessmentRequestCancellation = new AssessmentRequestCancellation();
    
    assessmentRequestCancellation.setStudentEntityId(studentEntityId);
    assessmentRequestCancellation.setWorkspaceEntityId(workspaceEntityId);
    assessmentRequestCancellation.setCancellationDate(cancellationDate);
    
    return persist(assessmentRequestCancellation);
  }

  public AssessmentRequestCancellation findLatestByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId) {
    List<AssessmentRequestCancellation> requests = listByStudentAndWorkspace(studentEntityId, workspaceEntityId);
    if (requests.isEmpty()) {
      return null;
    }
    else if (requests.size() > 1) {
      requests.sort(Comparator.comparing(AssessmentRequestCancellation::getCancellationDate).reversed());
    }
    return requests.get(0);
  }

  public List<AssessmentRequestCancellation> listByStudentAndWorkspace(Long studentEntityId, Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssessmentRequestCancellation> criteria = criteriaBuilder.createQuery(AssessmentRequestCancellation.class);
    Root<AssessmentRequestCancellation> root = criteria.from(AssessmentRequestCancellation.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AssessmentRequestCancellation_.studentEntityId), studentEntityId),
        criteriaBuilder.equal(root.get(AssessmentRequestCancellation_.workspaceEntityId), workspaceEntityId)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(AssessmentRequestCancellation assessmentRequestCancellation) {
    super.delete(assessmentRequestCancellation);
  }

}
