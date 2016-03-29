package fi.otavanopisto.muikku.plugins.forum.wall;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;



public class ForumThreadSubscriptionDAO extends CorePluginsDAO<ForumThreadSubscription> {

	private static final long serialVersionUID = 2496199219925814980L;

	public ForumThreadSubscription create(UserEntity user, ForumThread forumThread) {
	  ForumThreadSubscription forumSubscription = new ForumThreadSubscription();
    
    forumSubscription.setUser(user.getId());
    forumSubscription.setForumThread(forumThread);
    
    getEntityManager().persist(forumSubscription);
    
    return forumSubscription;
  }

  public List<ForumThreadSubscription> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumThreadSubscription> criteria = criteriaBuilder.createQuery(ForumThreadSubscription.class);
    Root<ForumThreadSubscription> root = criteria.from(ForumThreadSubscription.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(ForumThreadSubscription_.user), user.getId()));
    
    return entityManager.createQuery(criteria).getResultList();
  }

//  public ForumThreadSubscription findByUserAndForumArea(UserEntity user, ForumArea forumArea) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<ForumAreaSubscription> criteria = criteriaBuilder.createQuery(ForumAreaSubscription.class);
//    Root<ForumAreaSubscription> root = criteria.from(ForumAreaSubscription.class);
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(ForumAreaSubscription_.user), user.getId()),
//            criteriaBuilder.equal(root.get(ForumAreaSubscription_.forumArea), forumArea)
//        )
//    );
//    
//    return getSingleResult(entityManager.createQuery(criteria));
//  }
  
}
