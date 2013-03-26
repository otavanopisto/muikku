package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.UserPassword;
import fi.muikku.model.security.UserPassword_;
import fi.muikku.model.stub.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserPasswordDAO extends CoreDAO<UserPassword> {

	private static final long serialVersionUID = 7012152525764351096L;

	public UserPassword create(UserEntity user, String passwordHash) {
    UserPassword userPassword = new UserPassword();
   
    userPassword.setUser(user);
    userPassword.setPasswordHash(passwordHash);
    
    getEntityManager().persist(userPassword);
    return userPassword;
  }
  
  public UserPassword updatePasswordHash(UserPassword userPassword, String passwordHash) {
    userPassword.setPasswordHash(passwordHash);

    getEntityManager().persist(userPassword);
    return userPassword;
  }
  
  public UserPassword findByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserPassword> criteria = criteriaBuilder.createQuery(UserPassword.class);
    Root<UserPassword> root = criteria.from(UserPassword.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserPassword_.user), user));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  
}
