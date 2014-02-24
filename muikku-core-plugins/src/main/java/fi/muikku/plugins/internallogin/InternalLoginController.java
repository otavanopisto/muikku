package fi.muikku.plugins.internallogin;

import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.controller.UserEntityController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.dao.InternalAuthDAO;
import fi.muikku.plugins.internallogin.dao.PasswordResetRequestDAO;
import fi.muikku.plugins.internallogin.model.InternalAuth;
import fi.muikku.plugins.internallogin.model.PasswordResetRequest;

@Dependent
@Stateful
public class InternalLoginController {
	
	@Inject
	private InternalAuthDAO internalAuthDAO;

	@Inject
  private PasswordResetRequestDAO passwordResetRequestDAO;
	
	@Inject
  private UserEntityController userEntityController;
	
	/**
	 * Returns the user entity corresponding to the given email address and password. If not found, returns <code>null</code>.
	 *  
	 * @param email Email address
	 * @param password Password
	 * 
	 * @return The user entity corresponding to the given credentials, or <code>null</code> if not found
	 */
	public UserEntity findUserByEmailAndPassword(String email, String password) {
    UserEntity userEntity = userEntityController.findUserByEmailAddress(email);
		if (userEntity != null) {
	   	String passwordHash = DigestUtils.md5Hex(password);
	   	InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(userEntity.getId(), passwordHash);
	   	if (internalAuth != null) {
	   		return userEntity;
	   	}
	  }
  	return null;
	}
	
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
