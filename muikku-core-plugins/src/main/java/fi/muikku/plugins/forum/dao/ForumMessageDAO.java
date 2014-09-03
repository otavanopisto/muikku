package fi.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.forum.model.ForumMessage_;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.WorkspaceForumArea_;



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
  
  
}
