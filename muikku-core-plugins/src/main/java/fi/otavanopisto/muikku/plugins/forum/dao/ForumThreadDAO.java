package fi.otavanopisto.muikku.plugins.forum.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.forum.model.ForumThread_;
import fi.otavanopisto.muikku.model.forum.LockForumThread;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;



public class ForumThreadDAO extends CorePluginsDAO<ForumThread> {
  
	private static final long serialVersionUID = 4967576871472917786L;

	public ForumThread create(ForumArea forumArea, String title, String message, UserEntity creator, Boolean sticky, LockForumThread lock) {
    Date now = new Date();

    return create(forumArea, title, message, now, creator, now, creator, false, sticky, lock, now);
  }
  
  public ForumThread create(ForumArea forumArea, String title, String message, Date created, UserEntity creator, Date lastModified, UserEntity lastModifier, Boolean archived, Boolean sticky, LockForumThread lock, Date updated) {
    ForumThread thread = new ForumThread();

    thread.setForumArea(forumArea);
    thread.setTitle(title);
    thread.setMessage(message);
    thread.setCreated(created);
    thread.setCreator(creator.getId());
    thread.setLastModified(lastModified);
    thread.setLastModifier(lastModifier.getId());
    thread.setArchived(archived);
    thread.setSticky(sticky);
    thread.setLock(lock);
    thread.setUpdated(updated);
    
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

  public List<ForumThread> listByForumAreaOrdered(ForumArea forumArea, int firstResult, int maxResults) {
    return listByForumAreaOrdered(forumArea, firstResult, maxResults, false);
  }
  
  public List<ForumThread> listByForumAreaOrdered(ForumArea forumArea, int firstResult, int maxResults, boolean includeArchived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThread> criteria = criteriaBuilder.createQuery(ForumThread.class);
    Root<ForumThread> root = criteria.from(ForumThread.class);
    criteria.select(root);
    if (!includeArchived) {
      criteria.where(
          criteriaBuilder.and(
              criteriaBuilder.equal(root.get(ForumThread_.forumArea), forumArea),
              criteriaBuilder.equal(root.get(ForumThread_.archived), Boolean.FALSE)
          )
      );
    } else {
      criteria.where(
          criteriaBuilder.equal(root.get(ForumThread_.forumArea), forumArea)
      );
    }

    criteria.orderBy(criteriaBuilder.desc(root.get(ForumThread_.sticky)), criteriaBuilder.desc(root.get(ForumThread_.updated)));
    
    TypedQuery<ForumThread> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public Long countByArea(ForumArea area) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ForumThread> root = criteria.from(ForumThread.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumThread_.forumArea), area),
            criteriaBuilder.equal(root.get(ForumThread_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public ForumThread update(ForumThread thread, String title, String message, Boolean sticky, LockForumThread lock, Date lastModified, UserEntity lastModifier) {
    thread.setTitle(title);
    thread.setMessage(message);
    thread.setSticky(sticky);
    thread.setLock(lock);
    thread.setLastModified(lastModified);
    thread.setLastModifier(lastModifier.getId());
    
    getEntityManager().persist(thread);
    
    return thread;
  }

  public ForumThread updateThreadUpdated(ForumThread thread, Date updated) {
    thread.setUpdated(updated);
    
    getEntityManager().persist(thread);

    return thread;
  }
  
  public ForumThread updateArchived(ForumThread thread, Boolean archived){
    thread.setArchived(archived);
    return persist(thread);
  }

  public List<ForumThread> listLatestOrdered(List<ForumArea> forumAreas, int firstResult, int maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThread> criteria = criteriaBuilder.createQuery(ForumThread.class);
    Root<ForumThread> root = criteria.from(ForumThread.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            root.get(ForumThread_.forumArea).in(forumAreas),
            criteriaBuilder.equal(root.get(ForumThread_.archived), Boolean.FALSE)
        )
    );

    criteria.orderBy(criteriaBuilder.desc(root.get(ForumThread_.sticky)), criteriaBuilder.desc(root.get(ForumThread_.updated)));
    
    TypedQuery<ForumThread> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public ForumThread toggleLock(ForumThread thread, LockForumThread lock, Long userEntityId) {
    thread.setLock(lock);
    thread.setLockBy(userEntityId);
    thread.setLockDate(new Date());
    getEntityManager().persist(thread);
    
    return thread;
  }
  
  @Override
  public void delete(ForumThread e) {
    super.delete(e);
  }
  
}
