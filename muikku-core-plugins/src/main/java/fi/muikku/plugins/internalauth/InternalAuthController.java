package fi.muikku.plugins.internalauth;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.codec.digest.DigestUtils;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internalauth.dao.InternalAuthDAO;
import fi.muikku.plugins.internalauth.model.InternalAuth;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;

@Dependent
@Stateful
public class InternalAuthController {

  @Inject
  private Logger logger;

  @Inject
  private InternalAuthDAO internalAuthDAO;

  @Inject
  private UserController userController;

  public InternalAuth findInternalAuthByEmailAndPassword(String email, String password) throws SchoolDataBridgeRequestException,
      UnexpectedSchoolDataBridgeException {
    String passwordHash = DigestUtils.md5Hex(password);
    UserEntity userEntity = findUserEntityByEmail(email);
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

  private UserEntity findUserEntityByEmail(String email) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    UserEntity result = null;

    List<User> users = userController.listUsersByEmail(email);

    for (User user : users) {
      UserEntity userEntity = userController.findUserEntity(user);
      if (userEntity != null) {
        if (result == null) {
          result = userEntity;
        } else {
          if (!result.getId().equals(userEntity.getId())) {
            // TODO: Proper error handling
            logger.severe("Several UserEntities found with given email: " + email);
            throw new RuntimeException("Several UserEntities found with given email: " + email);
          }
        }
      }
    }

    return result;
  }

}
