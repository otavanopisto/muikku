package fi.muikku.plugins.assessmentrequest;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;

public class AssessmentRequestDAO extends CorePluginsDAO<AssessmentRequest> {

  private static final long serialVersionUID = -596724055841154832L;

  public AssessmentRequest create(WorkspaceEntity workspaceEntity, UserEntity student, Date date, String message, AssessmentRequestState state) {
    AssessmentRequest assessmentRequest = new AssessmentRequest();

    assessmentRequest.setWorkspace(workspaceEntity.getId());
    assessmentRequest.setStudent(student.getId());
    assessmentRequest.setDate(date);
    assessmentRequest.setMessage(message);
    assessmentRequest.setState(state);

    getEntityManager().persist(assessmentRequest);

    return assessmentRequest;
  }

  public List<AssessmentRequest> listByWorkspace(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssessmentRequest> criteria = criteriaBuilder.createQuery(AssessmentRequest.class);
    Root<AssessmentRequest> root = criteria.from(AssessmentRequest.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AssessmentRequest_.workspace), workspaceEntity.getId()));

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AssessmentRequest> listByWorkspaceIdAndStudentIdOrderByCreated(
      Long workspaceEntityId,
      Long studentEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssessmentRequest> criteria = criteriaBuilder.createQuery(AssessmentRequest.class);
    Root<AssessmentRequest> root = criteria.from(AssessmentRequest.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AssessmentRequest_.workspace), workspaceEntityId)),
        criteriaBuilder.equal(root.get(AssessmentRequest_.student), studentEntityId));
    criteria.orderBy(criteriaBuilder.desc(root.get(AssessmentRequest_.date)));

    return entityManager.createQuery(criteria).getResultList();
  }
}
