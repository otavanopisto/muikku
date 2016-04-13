package fi.otavanopisto.muikku.plugins.internalauth;

import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.internalauth.dao.InternalAuthDAO;
import fi.otavanopisto.muikku.plugins.internalauth.model.InternalAuth;
import fi.otavanopisto.muikku.users.UserEntityController;

public class InternalAuthController {

  @Inject
  private InternalAuthDAO internalAuthDAO;

  @Inject
  private UserEntityController userEntityController;

  public InternalAuth findInternalAuthByEmailAndPassword(String email, String password) {
    String passwordHash = DigestUtils.md5Hex(password);
    UserEntity userEntity = userEntityController.findUserEntityByEmailAddress(email);
    if (userEntity != null) {
      InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(userEntity.getId(), passwordHash);
      return internalAuth;
    }
    return null;
  }

  public boolean updateUserEntityPassword(Long userEntityId, String hashedPassword) {
    InternalAuth internalAuth = internalAuthDAO.findByUserId(userEntityId);
    if (internalAuth != null) {
      internalAuth.setPassword(hashedPassword);
      return true;
    } else {
      return false;
    }
  }

  public boolean confirmUserPassword(UserEntity user, String password) {
    String passwordHash = DigestUtils.md5Hex(password);
    InternalAuth internalAuth = internalAuthDAO.findByUserIdAndPassword(user.getId(), passwordHash);

    return internalAuth != null;
  }

  public void updateUserPassword(UserEntity user, String passwordHash, String newPasswordHash) {
    if (confirmUserPassword(user, passwordHash)) {
      String passwordHashCoded = DigestUtils.md5Hex(passwordHash);
      String newPasswordHashCoded = DigestUtils.md5Hex(newPasswordHash);
      
      internalAuthDAO.updatePassword(user, passwordHashCoded, newPasswordHashCoded);
    }
  }
}
