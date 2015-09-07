package fi.muikku.plugins.user;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.CorePluginsDAO;

public class UserPendingPasswordChangeDAO extends CorePluginsDAO<UserPendingPasswordChange> {

  private static final long serialVersionUID = 5503016597955204959L;

  public UserPendingPasswordChange create(UserEntity userEntity, String confirmationHash) {
    UserPendingPasswordChange userPendingPasswordChange = new UserPendingPasswordChange();
    
    userPendingPasswordChange.setConfirmationHash(confirmationHash);
    userPendingPasswordChange.setUserEntity(userEntity.getId());
    
    getEntityManager().persist(userPendingPasswordChange);
    
    return userPendingPasswordChange;
  }
  
  public void delete(UserPendingPasswordChange userPendingPasswordChange) {
    super.delete(userPendingPasswordChange);
  }

  public UserPendingPasswordChange findByConfirmationHash(String confirmationHash) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserPendingPasswordChange> criteria = criteriaBuilder.createQuery(UserPendingPasswordChange.class);
    Root<UserPendingPasswordChange> root = criteria.from(UserPendingPasswordChange.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserPendingPasswordChange_.confirmationHash), confirmationHash));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserPendingPasswordChange findByUserEntity(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserPendingPasswordChange> criteria = criteriaBuilder.createQuery(UserPendingPasswordChange.class);
    Root<UserPendingPasswordChange> root = criteria.from(UserPendingPasswordChange.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserPendingPasswordChange_.userEntity), userEntity.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserPendingPasswordChange updateHash(UserPendingPasswordChange passwordChange, String confirmationHash) {
    passwordChange.setConfirmationHash(confirmationHash);
    
    getEntityManager().persist(passwordChange);
    
    return passwordChange;
  }

}
