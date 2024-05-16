package fi.otavanopisto.muikku.users;

import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.UserEntityFileDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;

@ApplicationScoped
public class UserProfilePictureController {

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEntityFileDAO userEntityFileDAO;

  @PostConstruct
  public void init() {
    profileImages = new ConcurrentHashMap<>();
  }
  
  public void setHasProfilePicture(UserEntity userEntity, Boolean hasImage) {
    profileImages.put(userEntity.getId(), hasImage);
  }

  public boolean hasProfilePicture(Long userEntityId) {
    if (!profileImages.containsKey(userEntityId)) {
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      profileImages.put(userEntity.getId(), userEntity == null ? Boolean.FALSE : userEntityFileDAO.countByUserEntityAndIdentifier(userEntity, "profile-image-original") > 0);
    }
    return profileImages.get(userEntityId);
  }

  public boolean hasProfilePicture(UserEntity userEntity) {
    if (!profileImages.containsKey(userEntity.getId())) {
      profileImages.put(userEntity.getId(), userEntityFileDAO.countByUserEntityAndIdentifier(userEntity, "profile-image-original") > 0);
    }
    return profileImages.get(userEntity.getId());
  }
  
  private ConcurrentHashMap<Long, Boolean> profileImages;

}
