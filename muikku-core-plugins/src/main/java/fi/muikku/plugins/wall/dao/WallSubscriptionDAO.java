package fi.muikku.plugins.wall.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.WallSubscription;
import fi.muikku.plugins.wall.model.WallSubscription_;


@DAO
public class WallSubscriptionDAO extends PluginDAO<WallSubscription> {

	private static final long serialVersionUID = -5346861966983853013L;

	public List<WallSubscription> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallSubscription> criteria = criteriaBuilder.createQuery(WallSubscription.class);
    Root<WallSubscription> root = criteria.from(WallSubscription.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WallSubscription_.user), user.getId()));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
