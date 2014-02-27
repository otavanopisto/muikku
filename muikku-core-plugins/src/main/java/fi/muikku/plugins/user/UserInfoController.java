package fi.muikku.plugins.user;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.controller.UserEntityController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserController;
import fi.muikku.session.SessionController;

@Dependent
public class UserInfoController {

  @Inject
  private UserPendingEmailChangeDAO userPendingEmailChangeDAO;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private Mailer mailer;

  @Inject
  private SessionController sessionController;
  
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

  public void confirmEmailChange(UserPendingEmailChange pendingEmailChange) {
    UserEmailEntity userEmail = userEntityController.findUserEmailEntityById(pendingEmailChange.getUserEmailEntity());
    
    UserEntity user = sessionController.getUser();
    
    if (user.getId().equals(userEmail.getUser().getId())) {
      // Change Email
      userEntityController.updateUserEmail(userEmail, pendingEmailChange.getNewEmail());
      
      // Delete Pender
      userPendingEmailChangeDAO.delete(pendingEmailChange);
    }
  }

  public UserPendingEmailChange findPendingEmailChangeByHash(String confirmationHash) {
    return userPendingEmailChangeDAO.findByConfirmationHash(confirmationHash);
  }
}
