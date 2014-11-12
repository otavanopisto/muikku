package fi.muikku.plugins.forgotpassword;

import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.auth.AuthSourceController;
import fi.muikku.users.UserEntityController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forgotpassword.dao.PasswordResetRequestDAO;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest;

@Dependent
@Stateful
public class ForgotPasswordController {
	
	@Inject
  private PasswordResetRequestDAO passwordResetRequestDAO;
	
	@Inject
  private UserEntityController userEntityController;
	
	@Inject
	private AuthSourceController authSourceController;
	/**
	 * Creates a new password reset request for the given user.
	 * 
	 * @param userEntity The user entity
	 * 
	 * @return The created password reset request
	 */
	public PasswordResetRequest createPasswordResetRequest(UserEntity userEntity) {
	  return passwordResetRequestDAO.create(userEntity.getId(), UUID.randomUUID().toString());
	}

	/**
   * Returns a password reset request for the given user. If the user has no active password reset request, returns <code>null</code>.
   * 
   * @param userEntity The user entity
   * 
   * @return The password reset request for the given user, or <code>null</code> if not found
   */
  public PasswordResetRequest findPasswordResetRequestByUser(UserEntity userEntity) {
    return passwordResetRequestDAO.findByUserEntityId(userEntity.getId());
  }

	/**
   * Returns a password reset request for the given hash. If there's no request with given hash, return <code>null</code>.
   * 
   * @param resetHash the reset hash.
   * 
   * @return The password reset request for the given hash, or <code>null</code> if not found
   */
  public PasswordResetRequest findPasswordResetRequestByResetHash(String resetHash) {
    return passwordResetRequestDAO.findByResetHash(resetHash);
  }
  
  /**
   * Updates the last login time of the given user entity to the current time.
   * 
   * @param userEntity The user entity to be updated
   * 
   *  @return The updated user entity
   */
  public UserEntity updateLastLogin(UserEntity userEntity) {
    return userEntityController.updateLastLogin(userEntity);
  }
  
  /**
   * Updates the reset hash of the given password reset request.
   * 
   * @param passwordResetRequest The password reset request
   * 
   * @return The updated password reset request
   */
  public PasswordResetRequest updateResetHash(PasswordResetRequest passwordResetRequest) {
    return passwordResetRequestDAO.updateResetHash(passwordResetRequest, UUID.randomUUID().toString());
  }
  
}
