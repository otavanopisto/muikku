package fi.otavanopisto.muikku.dao.workspace;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage_;

public class WorkspaceSignupMessageDAO extends CoreDAO<WorkspaceSignupMessage> {
	
  private static final long serialVersionUID = -5858701935832435144L;

  public WorkspaceSignupMessage create(WorkspaceEntity workspaceEntity, boolean defaultMessage, 
      boolean enabled, String caption, String content, List<UserGroupEntity> signupGroups) {
    WorkspaceSignupMessage workspaceEntityMessage = new WorkspaceSignupMessage();
    
    workspaceEntityMessage.setWorkspaceEntity(workspaceEntity);
    workspaceEntityMessage.setDefaultMessage(defaultMessage);
    workspaceEntityMessage.setEnabled(enabled);
    workspaceEntityMessage.setCaption(caption);
    workspaceEntityMessage.setContent(content);
    workspaceEntityMessage.setUserGroupEntities(signupGroups);
    
    getEntityManager().persist(workspaceEntityMessage);
    
    return workspaceEntityMessage;
  }

  @Override
  public void delete(WorkspaceSignupMessage e) {
    super.delete(e);
  }

//  /**
//   * Returns the signup message set for given workspace and signup group.
//   * 
//   * @param workspaceEntity
//   * @param signupGroupEntity
//   * @return
//   */
//  public WorkspaceSignupMessage findBy(WorkspaceEntity workspaceEntity, UserGroupEntity signupGroupEntity) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<WorkspaceSignupMessage> criteria = criteriaBuilder.createQuery(WorkspaceSignupMessage.class);
//    Root<WorkspaceSignupMessage> root = criteria.from(WorkspaceSignupMessage.class);
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.workspaceEntity), workspaceEntity),
//            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.signupGroupEntity), signupGroupEntity)
//        )
//    );
//    
//    return getSingleResult(entityManager.createQuery(criteria));
//  }

  /**
   * Returns the default (the one with null signupGroupEntity) signup message of a given workspace.
   * 
   * @param workspaceEntity
   * @return
   */
  public WorkspaceSignupMessage findDefaultSignupMessageBy(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceSignupMessage> criteria = criteriaBuilder.createQuery(WorkspaceSignupMessage.class);
    Root<WorkspaceSignupMessage> root = criteria.from(WorkspaceSignupMessage.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.defaultMessage), Boolean.TRUE)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  /**
   * Lists signup messages for given workspace which have a specified signup group.
   * 
   * @param workspaceEntity
   * @return
   */
  public List<WorkspaceSignupMessage> listGroupBoundSignupMessagesBy(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceSignupMessage> criteria = criteriaBuilder.createQuery(WorkspaceSignupMessage.class);
    Root<WorkspaceSignupMessage> root = criteria.from(WorkspaceSignupMessage.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.defaultMessage), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  /**
   * Lists enabled signup messages matching given workspace and any of the user groups.
   * 
   * @param workspaceEntity
   * @param signupGroupEntities
   * @return
   */
  public List<WorkspaceSignupMessage> listEnabledGroupBoundSignupMessagesBy(WorkspaceEntity workspaceEntity, Collection<UserGroupEntity> signupGroupEntities) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceSignupMessage> criteria = criteriaBuilder.createQuery(WorkspaceSignupMessage.class);
    Root<WorkspaceSignupMessage> root = criteria.from(WorkspaceSignupMessage.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.enabled), Boolean.TRUE),
            criteriaBuilder.equal(root.get(WorkspaceSignupMessage_.workspaceEntity), workspaceEntity),
            root.get(WorkspaceSignupMessage_.userGroupEntities).in(signupGroupEntities)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceSignupMessage update(WorkspaceSignupMessage workspaceEntityMessage, boolean enabled, String caption, String content, List<UserGroupEntity> signupGroups) {
    workspaceEntityMessage.setEnabled(enabled);
    workspaceEntityMessage.setCaption(caption);
    workspaceEntityMessage.setContent(content);
    workspaceEntityMessage.setUserGroupEntities(signupGroups);
    
    getEntityManager().persist(workspaceEntityMessage);
    
    return workspaceEntityMessage;
  }
  
}
