package fi.otavanopisto.muikku.dao.users;

import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEmailEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;

public class UserEmailEntityDAO extends CoreDAO<UserEmailEntity> {

  private static final long serialVersionUID = -6107936582505695829L;
  
  /**
   * Creates a new user email address.
   * 
   * @param user The user
   * @param address The email address
   * 
   * @return The created email address
   */
  public UserEmailEntity create(UserEntity user, String address) {
    UserEmailEntity userEmail = new UserEmailEntity();
    
    userEmail.setUser(user);
    userEmail.setAddress(address);
    
    return persist(userEmail);
  }
  
  /**
   * Finds the user email address entity based on the given email address. If not found, returns <code>null</code>.
   * 
   * @param address The email address
   * 
   * @return The entity corresponding to the given email address, or <code>null</code> if not found
   */
  public UserEmailEntity findByAddress(String address) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserEmailEntity_.address), address)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  /**
   * Lists all email addresses of the given user.
   * 
   * @param user The user
   * 
   * @return A list of all email addresses of the given user
   */
  public List<UserEmailEntity> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserEmailEntity_.user), user)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserEmailEntity> listByAddresses(List<String> addresses) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      root.get(UserEmailEntity_.address).in(addresses)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserEntity> listUsersByAddresses(List<String> addresses) {
    if (addresses.isEmpty()) {
      return Collections.emptyList();
    }
    
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEntity> criteria = criteriaBuilder.createQuery(UserEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root.get(UserEmailEntity_.user));
    criteria.where(
      root.get(UserEmailEntity_.address).in(addresses)
    ).distinct(true);
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public UserEmailEntity updateAddress(UserEmailEntity userEmail, String address) {
    userEmail.setAddress(address);
    return persist(userEmail);
  }

  /**
   * Deletes the given user email address.
   * 
   * @param userEmail The email address to delete
   */
  public void delete(UserEmailEntity userEmail) {
    super.delete(userEmail);
  }

}
