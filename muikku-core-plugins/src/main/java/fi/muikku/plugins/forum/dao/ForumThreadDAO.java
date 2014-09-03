package fi.muikku.plugins.forum.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThread_;



public class ForumThreadDAO extends CorePluginsDAO<ForumThread> {
  
	private static final long serialVersionUID = 4967576871472917786L;

	public ForumThread create(ForumArea forumArea, String title, String message, UserEntity creator) {
    Date now = new Date();

    return create(forumArea, title, message, now, creator, now, creator, false);
  }
  
  public ForumThread create(ForumArea forumArea, String title, String message, Date created, UserEntity creator, Date lastModified, UserEntity lastModifier, Boolean archived) {
    ForumThread thread = new ForumThread();

    thread.setForumArea(forumArea);
    thread.setTitle(title);
    thread.setMessage(message);
    thread.setCreated(created);
    thread.setCreator(creator.getId());
    thread.setLastModified(lastModified);
    thread.setLastModifier(lastModifier.getId());
    thread.setArchived(archived);
    
    getEntityManager().persist(thread);
    
    return thread;
  }
 
  public List<ForumThread> listByForumArea(ForumArea forumArea) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThread> criteria = criteriaBuilder.createQuery(ForumThread.class);
    Root<ForumThread> root = criteria.from(ForumThread.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumThread_.forumArea), forumArea),
            criteriaBuilder.equal(root.get(ForumThread_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
