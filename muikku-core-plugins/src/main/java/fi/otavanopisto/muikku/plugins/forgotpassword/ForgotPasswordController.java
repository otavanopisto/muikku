package fi.otavanopisto.muikku.plugins.forgotpassword;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChange;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserEntityController;

@Dependent
public class ForgotPasswordController {

  @Inject
  private Logger logger;

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  public boolean isValidPasswordChangeHash(String confirmationHash) {
    return userPendingPasswordChangeDAO.findByConfirmationHash(confirmationHash) != null;
  }

  public String getUsername(String confirmationHash) {
    UserPendingPasswordChange userPendingPasswordChange = userPendingPasswordChangeDAO.findByConfirmationHash(confirmationHash);
    if (userPendingPasswordChange != null) {
      Long userEntityId = userPendingPasswordChange.getUserEntity();
      if (userEntityId == null) {
        logger.severe(String.format("UserPendingPasswordChange with hash %s did not contain userEnityId", confirmationHash));
        return null;
      }
      
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      if (userEntity == null) {
        logger.severe(String.format("UserPendingPasswordChange with hash %s contained invalid userEnityId", confirmationHash));
        return null;
      }
      
      schoolDataBridgeSessionController.startSystemSession();
      try {
        User user = userSchoolDataController.findUser(userEntity.getDefaultSchoolDataSource(), userEntity.getDefaultIdentifier());
        if (user == null) {
          logger.severe(String.format("Failed to retrieve user for UserEntity %d", userEntity.getId()));
          return null;
        }
        
        SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());
        try {
          return userSchoolDataController.findUsername(user);
        } catch (Exception e) {
          logger.log(Level.SEVERE, String.format("Failed to fetch username for user %s", userIdentifier.toId()));
          return null;
        }      
      } finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
    }
    
    return null;
  }

  public boolean resetPassword(String confirmationHash, String password) {
    UserPendingPasswordChange userPendingPasswordChange = userPendingPasswordChangeDAO.findByConfirmationHash(confirmationHash);
    if (userPendingPasswordChange != null) {

      UserEntity userEntity = userEntityController.findUserEntityById(userPendingPasswordChange.getUserEntity());
      if (userEntity == null) {
        logger.severe(String.format("UserPendingPasswordChange with hash %s contained invalid userEnityId", confirmationHash));
        return false;
      }
      
      try {
        userSchoolDataController.confirmResetPassword(userEntity.getDefaultSchoolDataSource(), confirmationHash, password);
      } catch (SchoolDataBridgeUnauthorizedException e) {
        logger.log(Level.SEVERE, "Failed to process password reset request", e);
        return false;
      }

      userPendingPasswordChangeDAO.delete(userPendingPasswordChange);
      
      return true;
    }
    
    return false;
  }
  
}
