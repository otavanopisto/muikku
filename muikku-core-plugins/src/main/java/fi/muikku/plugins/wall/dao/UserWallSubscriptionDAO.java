package fi.muikku.plugins.wall.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.wall.model.UserWallSubscription;
import fi.muikku.plugins.wall.model.UserWallSubscription_;
import fi.muikku.plugins.wall.model.Wall;



public class UserWallSubscriptionDAO extends CorePluginsDAO<UserWallSubscription> {

	private static final long serialVersionUID = 143710050263938462L;

	public UserWallSubscription create(UserEntity user, Wall wall) {
    UserWallSubscription userWallLink = new UserWallSubscription();
    
    userWallLink.setUser(user.getId());
    userWallLink.setWall(wall);
    
    getEntityManager().persist(userWallLink);
    
    return userWallLink;
  }

  public List<UserWallSubscription> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWallSubscription> criteria = criteriaBuilder.createQuery(UserWallSubscription.class);
    Root<UserWallSubscription> root = criteria.from(UserWallSubscription.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserWallSubscription_.user), user.getId()));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
