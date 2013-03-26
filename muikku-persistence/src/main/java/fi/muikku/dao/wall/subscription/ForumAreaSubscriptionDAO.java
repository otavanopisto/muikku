package fi.muikku.dao.wall.subscription;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.forum.ForumArea;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.subscription.ForumAreaSubscription;
import fi.muikku.model.wall.subscription.ForumAreaSubscription_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class ForumAreaSubscriptionDAO extends CoreDAO<ForumAreaSubscription> {

	private static final long serialVersionUID = 2496199219925814980L;

	public ForumAreaSubscription create(UserEntity user, ForumArea forumArea) {
    ForumAreaSubscription forumSubscription = new ForumAreaSubscription();
    
    forumSubscription.setUser(user);
    forumSubscription.setForumArea(forumArea);
    
    getEntityManager().persist(forumSubscription);
    
    return forumSubscription;
  }

  public List<ForumAreaSubscription> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumAreaSubscription> criteria = criteriaBuilder.createQuery(ForumAreaSubscription.class);
    Root<ForumAreaSubscription> root = criteria.from(ForumAreaSubscription.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(ForumAreaSubscription_.user), user));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public ForumAreaSubscription findByUserAndForumArea(UserEntity user, ForumArea forumArea) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ForumAreaSubscription> criteria = criteriaBuilder.createQuery(ForumAreaSubscription.class);
    Root<ForumAreaSubscription> root = criteria.from(ForumAreaSubscription.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ForumAreaSubscription_.user), user),
            criteriaBuilder.equal(root.get(ForumAreaSubscription_.forumArea), forumArea)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
