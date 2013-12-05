package fi.muikku.plugins.guidancerequest;

import java.util.Date;
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
public class WorkspaceGuidanceRequestDAO extends PluginDAO<WorkspaceGuidanceRequest> {

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
  
  
}
