package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.guidancerequest.WorkspaceGuidanceRequest_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.guidancerequest.WorkspaceGuidanceRequest;



public class WorkspaceGuidanceRequestDAO extends CorePluginsDAO<WorkspaceGuidanceRequest> {

  private static final long serialVersionUID = -8561225819989957176L;

  public WorkspaceGuidanceRequest create(WorkspaceEntity workspaceEntity, UserEntity student, Date date, String message) {
    WorkspaceGuidanceRequest assessmentRequest = new WorkspaceGuidanceRequest();
    
    assessmentRequest.setWorkspace(workspaceEntity.getId());
    assessmentRequest.setStudent(student.getId());
    assessmentRequest.setDate(date);
    assessmentRequest.setMessage(message);
    
    getEntityManager().persist(assessmentRequest);
    
    return assessmentRequest;
  }

  public List<WorkspaceGuidanceRequest> listByWorkspace(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceGuidanceRequest> criteria = criteriaBuilder.createQuery(WorkspaceGuidanceRequest.class);
    Root<WorkspaceGuidanceRequest> root = criteria.from(WorkspaceGuidanceRequest.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceGuidanceRequest_.workspace), workspaceEntity.getId()));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceGuidanceRequest> listByWorkspaceAndUser(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceGuidanceRequest> criteria = criteriaBuilder.createQuery(WorkspaceGuidanceRequest.class);
    Root<WorkspaceGuidanceRequest> root = criteria.from(WorkspaceGuidanceRequest.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceGuidanceRequest_.workspace), workspaceEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceGuidanceRequest_.student), userEntity.getId())
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
}
