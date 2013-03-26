package fi.muikku.dao.wall.subscription;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.subscription.WallSubscription;
import fi.muikku.model.wall.subscription.WallSubscription_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class WallSubscriptionDAO extends CoreDAO<WallSubscription> {

	private static final long serialVersionUID = -5346861966983853013L;

	public List<WallSubscription> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallSubscription> criteria = criteriaBuilder.createQuery(WallSubscription.class);
    Root<WallSubscription> root = criteria.from(WallSubscription.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WallSubscription_.user), user));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
