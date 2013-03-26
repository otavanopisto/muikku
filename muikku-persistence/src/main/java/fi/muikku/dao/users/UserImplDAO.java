package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.UserImpl;
import fi.muikku.model.users.UserImpl_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserImplDAO extends CoreDAO<UserImpl> {

	private static final long serialVersionUID = -990189904520649451L;

	public UserImpl create(UserEntity userEntity, String firstName, String lastName, String email) {
    UserImpl user = new UserImpl();
    user.setFirstName(firstName);
    user.setLastName(lastName);
    user.setEmail(email);
    user.setUserEntity(userEntity);

    getEntityManager().persist(user);
    
    return user;
  }

  public UserImpl findByEmail(String email) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserImpl> criteria = criteriaBuilder.createQuery(UserImpl.class);
    Root<UserImpl> root = criteria.from(UserImpl.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserImpl_.email), email));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserImpl findByUserEntity(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserImpl> criteria = criteriaBuilder.createQuery(UserImpl.class);
    Root<UserImpl> root = criteria.from(UserImpl.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserImpl_.userEntity), userEntity));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}