package fi.muikku.plugins.internallogin;

import java.util.Map;
import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.auth.AuthSourceController;
import fi.muikku.auth.AuthenticationProvider;
import fi.muikku.auth.AuthenticationResult;
import fi.muikku.controller.UserEntityController;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.dao.PasswordResetRequestDAO;
import fi.muikku.plugins.internallogin.model.PasswordResetRequest;

@Dependent
@Stateful
public class InternalLoginController {
	
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
