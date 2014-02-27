package fi.muikku.plugins.user;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.controller.UserEntityController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.InternalLoginController;
import fi.muikku.schooldata.UserController;

@Dependent
public class UserInfoController {

  @Inject
  private UserPendingEmailChangeDAO userPendingEmailChangeDAO;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private InternalLoginController internalLoginController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private Mailer mailer;

  public UserPendingEmailChange createEmailChange(UserEmailEntity userEmailEntity, String newEmail) {
    String confirmationHash = DigestUtils.md5Hex(
        userEmailEntity.getId() + 
        newEmail +
        System.currentTimeMillis()
        );
    
    return userPendingEmailChangeDAO.create(userEmailEntity, newEmail, confirmationHash);
  }
  
  public boolean hasPendingEmailChange(UserEmailEntity userEmailEntity) {
    return userPendingEmailChangeDAO.findByUserEmailEntity(userEmailEntity) != null;
  }

  public void confirmEmailChange(UserEntity user, String passwordHash, UserPendingEmailChange pendingEmailChange) {
    UserEmailEntity userEmail = userEntityController.findUserEmailEntityById(pendingEmailChange.getUserEmailEntity());
    
    if (user.getId().equals(userEmail.getUser().getId())) {
      // Confirm password
      if (internalLoginController.confirmUserPassword(userEmail.getUser(), passwordHash)) {
        // Change Email
        userEntityController.updateUserEmail(userEmail, pendingEmailChange.getNewEmail());
        
        // Delete Pender
        userPendingEmailChangeDAO.delete(pendingEmailChange);
      }
    }
  }

  public UserPendingEmailChange findPendingEmailChangeByHash(String confirmationHash) {
    return userPendingEmailChangeDAO.findByConfirmationHash(confirmationHash);
  }
}
