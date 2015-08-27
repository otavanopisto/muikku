package fi.muikku.plugins.assessmentrequest;


import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;


public class AssessmentRequestMessageIdDAO extends CorePluginsDAO<AssessmentRequestMessageId> {

  private static final long serialVersionUID = 6322868515683530647L;

  public AssessmentRequestMessageId create(WorkspaceUserEntity workspaceUserEntity, CommunicatorMessageId communicatorMessageId) {
    AssessmentRequestMessageId assessmentRequestMessageId = new AssessmentRequestMessageId();
    
    assessmentRequestMessageId.setWorkspaceUserId(workspaceUserEntity.getId());
    assessmentRequestMessageId.setCommunicatorMessageId(communicatorMessageId.getId());
    
    getEntityManager().persist(assessmentRequestMessageId);
    
    return assessmentRequestMessageId;
  }
  
  public AssessmentRequestMessageId findByWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AssessmentRequestMessageId> criteria = criteriaBuilder.createQuery(AssessmentRequestMessageId.class);
    Root<AssessmentRequestMessageId> root = criteria.from(AssessmentRequestMessageId.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(AssessmentRequestMessageId_.workspaceUserId), workspaceUserEntity.getId())
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public AssessmentRequestMessageId updateMessageId(AssessmentRequestMessageId assessmentRequestMessageId, CommunicatorMessageId communicatorMessageId) {
    assessmentRequestMessageId.setCommunicatorMessageId(communicatorMessageId.getId());
    
    getEntityManager().persist(assessmentRequestMessageId);
    
    return assessmentRequestMessageId;
  }
  
  
}
