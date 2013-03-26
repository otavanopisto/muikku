package fi.muikku.dao.forum;

import java.util.Date;
import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.forum.ForumArea;
import fi.muikku.model.forum.ForumThread;
import fi.muikku.model.forum.ForumThread_;
import fi.muikku.model.stub.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class ForumThreadDAO extends CoreDAO<ForumThread> {
  
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
    thread.setCreator(creator);
    thread.setLastModified(lastModified);
    thread.setLastModifier(lastModifier);
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
