package fi.otavanopisto.muikku.plugins.user;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.UserEntityFileDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityFile;
import fi.otavanopisto.muikku.model.users.UserEntityFileVisibility;
import fi.otavanopisto.muikku.session.SessionController;

public class UserEntityFileController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityFileDAO userEntityFileDAO;

  public UserEntityFile storeUserEntityFile(String identifier, String name, String contentType, byte[] data, UserEntityFileVisibility visibility) {
    System.out.println("store " + identifier + " with file name " + name);
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    UserEntityFile userEntityFile = userEntityFileDAO.findByUserEntityAndIdentifier(userEntity, identifier);
    if (userEntityFile == null) {
      userEntityFile = userEntityFileDAO.create(userEntity, identifier, name, contentType, data, visibility);
    }
    else {
      userEntityFile = userEntityFileDAO.updateData(userEntityFile, identifier, name, contentType, data, visibility);
    }
    return userEntityFile;
  }
  
  public UserEntityFile findByUserEntityAndIdentifier(UserEntity userEntity, String identifier) {
    return userEntityFileDAO.findByUserEntityAndIdentifier(userEntity, identifier);
  }
  
}
