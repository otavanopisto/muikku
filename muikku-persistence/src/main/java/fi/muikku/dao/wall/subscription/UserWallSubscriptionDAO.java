package fi.muikku.dao.wall.subscription;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.Wall;
import fi.muikku.model.wall.subscription.UserWallSubscription;
import fi.muikku.model.wall.subscription.UserWallSubscription_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserWallSubscriptionDAO extends CoreDAO<UserWallSubscription> {

	private static final long serialVersionUID = 143710050263938462L;

	public UserWallSubscription create(UserEntity user, Wall wall) {
    UserWallSubscription userWallLink = new UserWallSubscription();
    
    userWallLink.setUser(user);
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
    criteria.where(criteriaBuilder.equal(root.get(UserWallSubscription_.user), user));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
