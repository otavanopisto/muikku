package fi.otavanopisto.muikku.plugins.forum.wall;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription;


public class ForumAreaSubscriptionDAO extends CorePluginsDAO<ForumAreaSubscription> {

	private static final long serialVersionUID = 2496199219925814980L;

	public ForumAreaSubscription create(UserEntity user, ForumArea forumArea) {
    ForumAreaSubscription forumSubscription = new ForumAreaSubscription();
    
    forumSubscription.setUser(user.getId());
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
    criteria.where(criteriaBuilder.equal(root.get(ForumAreaSubscription_.user), user.getId()));
    
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
            criteriaBuilder.equal(root.get(ForumAreaSubscription_.user), user.getId()),
            criteriaBuilder.equal(root.get(ForumAreaSubscription_.forumArea), forumArea)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
