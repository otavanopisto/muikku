package fi.otavanopisto.muikku.users;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.dao.users.UserEntityFileDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityFile;
import fi.otavanopisto.muikku.model.users.UserEntityFileVisibility;
import fi.otavanopisto.muikku.session.SessionController;

public class UserEntityFileController {
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserProfilePictureController userProfilePictureController;

  @Inject
  private UserEntityFileDAO userEntityFileDAO;
  
  public boolean hasProfilePicture(UserEntity userEntity) {
    return userProfilePictureController.hasProfilePicture(userEntity);
  }

  public UserEntityFile storeUserEntityFile(String identifier, String name, String contentType, byte[] data, UserEntityFileVisibility visibility) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    UserEntityFile userEntityFile = userEntityFileDAO.findByUserEntityAndIdentifier(userEntity, identifier);
    if (userEntityFile == null) {
      userEntityFile = userEntityFileDAO.create(userEntity, identifier, name, contentType, data, visibility);
    }
    else {
      userEntityFile = userEntityFileDAO.updateData(userEntityFile, identifier, name, contentType, data, visibility);
    }
    if (StringUtils.equals(identifier, "profile-image-original")) {
      userProfilePictureController.setHasProfilePicture(userEntity, Boolean.TRUE);
    }
    return userEntityFile;
  }
  
  public void deleteUserEntityFile(UserEntityFile userEntityFile) {
    if (StringUtils.equals(userEntityFile.getIdentifier(), "profile-image-original")) {
      userProfilePictureController.setHasProfilePicture(userEntityFile.getUserEntity(), Boolean.FALSE);
    }
    userEntityFileDAO.delete(userEntityFile);
  }
  
  public UserEntityFile findByUserEntityAndIdentifier(UserEntity userEntity, String identifier) {
    return userEntityFileDAO.findByUserEntityAndIdentifier(userEntity, identifier);
  }
  
}
