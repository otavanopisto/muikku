package fi.muikku.plugins.assessmentrequest;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginDAO;


@DAO
public class AssessmentRequestDAO extends PluginDAO<AssessmentRequest> {

  private static final long serialVersionUID = -596724055841154832L;

  public AssessmentRequest create(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    AssessmentRequest assessmentRequest = new AssessmentRequest();
    
    assessmentRequest.setWorkspace(workspaceEntity.getId());
    assessmentRequest.setStudent(student.getId());
    assessmentRequest.setMessage(message);
    
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
  
  
}
