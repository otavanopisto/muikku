package fi.muikku.plugins.forgotpassword.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest_;

@DAO
public class PasswordResetRequestDAO extends CorePluginsDAO<PasswordResetRequest> {
	
	/**
   * Automatically generated serial version UID.
   */
  private static final long serialVersionUID = -1462717257246359256L;
  
  /**
   * Creates a new password reset request.
   * 
   * @param userEntityId User entity identifier
   * @param resetHash Reset hash
   * 
   * @return The created password reset request
   */
  public PasswordResetRequest create(Long userEntityId, String resetHash) {
    PasswordResetRequest passwordResetRequest = new PasswordResetRequest();

    passwordResetRequest.setUserEntityId(userEntityId);
    passwordResetRequest.setResetHash(resetHash);
   
    return persist(passwordResetRequest);
  }
  
  /**
   * Returns a password reset request corresponding to the given user entity identifier, or <code>null</code> if not found.
   * 
   * @param userEntityId User entity identifier
   * 
   * @return The password reset request of the given user, or <code>null</code> if not found
   */
  public PasswordResetRequest findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PasswordResetRequest> criteria = criteriaBuilder.createQuery(PasswordResetRequest.class);
    Root<PasswordResetRequest> root = criteria.from(PasswordResetRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(PasswordResetRequest_.userEntityId), userEntityId)
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }

  /**
   * Returns a password reset request with the specified hash, or <code>null</code> if not found.
   * 
   * @param userEntityId User entity identifier
   * 
   * @return The password reset request of the given hash, or <code>null</code> if not found
   */
  public PasswordResetRequest findByResetHash(String resetHash) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PasswordResetRequest> criteria = criteriaBuilder.createQuery(PasswordResetRequest.class);
    Root<PasswordResetRequest> root = criteria.from(PasswordResetRequest.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(PasswordResetRequest_.resetHash), resetHash)
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  /**
   * Updates the reset hash of the given password reset request.
   * 
   * @param passwordResetRequest The password reset request
   * @param resetHash The new reset hash
   * 
   * @return The updated password reset request
   */
  public PasswordResetRequest updateResetHash(PasswordResetRequest passwordResetRequest, String resetHash) {
    passwordResetRequest.setResetHash(resetHash);
    return persist(passwordResetRequest);
  }
	
}
