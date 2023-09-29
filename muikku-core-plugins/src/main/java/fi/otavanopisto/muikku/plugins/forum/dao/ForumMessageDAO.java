package fi.otavanopisto.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage_;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;



public class ForumMessageDAO extends CorePluginsDAO<ForumMessage> {

	private static final long serialVersionUID = 9013247702204973018L;
  
	
  public List<ForumMessage> listByContributingUser(UserEntity loggedUser) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumMessage> criteria = criteriaBuilder.createQuery(ForumMessage.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumMessage_.creator), loggedUser.getId()),
            criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<ForumMessage> listByWorkspace(WorkspaceEntity workspace) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumMessage> criteria = criteriaBuilder.createQuery(ForumMessage.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);
    Root<WorkspaceForumArea> root2 = criteria.from(WorkspaceForumArea.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root2.get(WorkspaceForumArea_.workspace), workspace.getId()),
            criteriaBuilder.equal(root2.get(WorkspaceForumArea_.id), root.get(ForumMessage_.forumArea)),
            criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public Long countByWorkspaceEntityAndCreator(Long workspaceEntityId, Long creatorId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);
    Root<WorkspaceForumArea> workspaceAreaJoin = criteria.from(WorkspaceForumArea.class);

    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(workspaceAreaJoin.get(WorkspaceForumArea_.workspace), workspaceEntityId),
        criteriaBuilder.equal(workspaceAreaJoin.get(WorkspaceForumArea_.id), root.get(ForumMessage_.forumArea)),
        criteriaBuilder.equal(root.get(ForumMessage_.creator), creatorId),
        criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public List<ForumMessage> listByWorkspaceEntityAndCreatorOrderByCreated(Long workspaceEntityId, Long creatorId, int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumMessage> criteria = criteriaBuilder.createQuery(ForumMessage.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);
    Root<WorkspaceForumArea> workspaceAreaJoin = criteria.from(WorkspaceForumArea.class);

    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(workspaceAreaJoin.get(WorkspaceForumArea_.workspace), workspaceEntityId),
        criteriaBuilder.equal(workspaceAreaJoin.get(WorkspaceForumArea_.id), root.get(ForumMessage_.forumArea)),
        criteriaBuilder.equal(root.get(ForumMessage_.creator), creatorId),
        criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
      )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(ForumMessage_.created)));
    
    TypedQuery<ForumMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public ForumMessage findLatestMessageByArea(ForumArea area) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumMessage> criteria = criteriaBuilder.createQuery(ForumMessage.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumMessage_.forumArea), area),
            criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
        )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(ForumMessage_.created)));
    
    TypedQuery<ForumMessage> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }

  public Long countByArea(ForumArea area) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ForumMessage> root = criteria.from(ForumMessage.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumMessage_.forumArea), area),
            criteriaBuilder.equal(root.get(ForumMessage_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public void archive(ForumMessage message) {
    message.setArchived(Boolean.TRUE);
    
    getEntityManager().persist(message);
  }
  
}
