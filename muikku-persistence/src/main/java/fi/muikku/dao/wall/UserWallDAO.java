package fi.muikku.dao.wall;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.UserWall;
import fi.muikku.model.wall.UserWall_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserWallDAO extends CoreDAO<UserWall> {

	private static final long serialVersionUID = -9075718046690498013L;

	public UserWall create(UserEntity user) {
    UserWall userWall = new UserWall();
    
    userWall.setUser(user);
    
    getEntityManager().persist(userWall);
    
    return userWall;
  }

  public UserWall findByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserWall> criteria = criteriaBuilder.createQuery(UserWall.class);
    Root<UserWall> root = criteria.from(UserWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserWall_.user), user));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
