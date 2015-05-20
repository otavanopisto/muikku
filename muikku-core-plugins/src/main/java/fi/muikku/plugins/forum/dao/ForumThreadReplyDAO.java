package fi.muikku.plugins.forum.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.forum.model.ForumThreadReply_;
import fi.muikku.plugins.forum.model.ForumThread_;



public class ForumThreadReplyDAO extends CorePluginsDAO<ForumThreadReply> {
  
	private static final long serialVersionUID = 6996591519523286352L;

	public ForumThreadReply create(ForumArea forumArea, ForumThread thread, String message, UserEntity creator) {
    Date now = new Date();

    return create(forumArea, thread, message, now, creator, now, creator, false);
  }
  
  public ForumThreadReply create(ForumArea forumArea, ForumThread thread, String message, Date created, UserEntity creator, Date lastModified, UserEntity lastModifier, Boolean archived) {
    ForumThreadReply reply = new ForumThreadReply();
    
    reply.setForumArea(forumArea);
    reply.setThread(thread);
    reply.setMessage(message);
    reply.setCreated(created);
    reply.setCreator(creator.getId());
    reply.setLastModified(lastModified);
    reply.setLastModifier(lastModifier.getId());
    reply.setArchived(archived);
    
    getEntityManager().persist(reply);
    
    return reply;
  }
  
  public List<ForumThreadReply> listByForumThread(ForumThread forumThread, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThreadReply> criteria = criteriaBuilder.createQuery(ForumThreadReply.class);
    Root<ForumThreadReply> root = criteria.from(ForumThreadReply.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumThreadReply_.thread), forumThread),
            criteriaBuilder.equal(root.get(ForumThreadReply_.archived), Boolean.FALSE)
        )
    );
    
    TypedQuery<ForumThreadReply> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public ForumThreadReply findLatestReplyByThread(ForumThread thread) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThreadReply> criteria = criteriaBuilder.createQuery(ForumThreadReply.class);
    Root<ForumThreadReply> root = criteria.from(ForumThreadReply.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumThreadReply_.thread), thread),
            criteriaBuilder.equal(root.get(ForumThreadReply_.archived), Boolean.FALSE)
        )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(ForumThreadReply_.created)));
    
    TypedQuery<ForumThreadReply> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }

  public Long countByThread(ForumThread thread) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ForumThreadReply> root = criteria.from(ForumThreadReply.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumThreadReply_.thread), thread),
            criteriaBuilder.equal(root.get(ForumThreadReply_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public ForumThreadReply findLatestReplyByArea(ForumArea area) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThreadReply> criteria = criteriaBuilder.createQuery(ForumThreadReply.class);
    Root<ForumThreadReply> root = criteria.from(ForumThreadReply.class);
    Join<ForumThreadReply, ForumThread> join = root.join(ForumThreadReply_.thread);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(join.get(ForumThread_.forumArea), area),
            criteriaBuilder.equal(root.get(ForumThreadReply_.archived), Boolean.FALSE)
        )
    );
    
    criteria.orderBy(criteriaBuilder.desc(root.get(ForumThreadReply_.created)));
    
    TypedQuery<ForumThreadReply> query = entityManager.createQuery(criteria);
    query.setMaxResults(1);
    
    return getSingleResult(query);
  }

  public ForumThreadReply update(ForumThreadReply reply, String message, Date lastModified, UserEntity lastModifier) {
    reply.setMessage(message);
    reply.setLastModified(lastModified);
    reply.setLastModifier(lastModifier.getId());
    
    getEntityManager().persist(reply);
    
    return reply;
  }

  @Override
  public void delete(ForumThreadReply e) {
    super.delete(e);
  }
}
