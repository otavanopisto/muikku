package fi.muikku.plugins.user;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.UserController;

@Dependent
public class UserInfoController {

  @Inject
  private UserPendingEmailChangeDAO userPendingEmailChangeDAO;
  
  @Inject
  private UserController userController;
  
  public UserPendingEmailChange createEmailChange(UserEntity userEntity, String newEmail) {
    String confirmationHash = DigestUtils.md5Hex(
        userEntity.getId() + 
        newEmail +
        System.currentTimeMillis()
        );
    return userPendingEmailChangeDAO.create(userEntity, newEmail, confirmationHash);
  }
  
  public boolean hasPendingEmailChange(UserEntity userEntity) {
    return userPendingEmailChangeDAO.findByUser(userEntity) != null;
  }

  public UserPendingEmailChange findPendingEmailChange(UserEntity userEntity) {
    return userPendingEmailChangeDAO.findByUser(userEntity);
  }
  
  public void confirmEmailChange(String passwordHash, UserPendingEmailChange pendingEmailChange) {
    UserEntity userEntity = userController.findUserEntityById(pendingEmailChange.getUser());
    
    // Confirm password
    
    // Change Email
    
    
    // Delete Pender
    userPendingEmailChangeDAO.delete(pendingEmailChange);
  }
}
