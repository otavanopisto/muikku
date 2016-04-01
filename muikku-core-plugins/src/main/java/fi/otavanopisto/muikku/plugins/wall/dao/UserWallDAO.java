package fi.otavanopisto.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.wall.model.UserWall_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.wall.model.UserWall;



public class UserWallDAO extends CorePluginsDAO<UserWall> {

	private static final long serialVersionUID = -9075718046690498013L;

	public UserWall create(UserEntity user) {
    UserWall userWall = new UserWall();
    
    userWall.setUser(user.getId());
    
    getEntityManager().persist(userWall);
    
    return userWall;
  }

  public UserWall findByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWall> criteria = criteriaBuilder.createQuery(UserWall.class);
    Root<UserWall> root = criteria.from(UserWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserWall_.user), user.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
