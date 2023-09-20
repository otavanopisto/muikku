package fi.otavanopisto.muikku.plugins.forum.rest;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.forum.ForumController;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;

public class ForumRESTModels {

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;

  @Inject
  private ForumController forumController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserEntityFileController userEntityFileController;
  
  public ForumThreadRESTModel restModel(ForumThread thread) {
    long numReplies = forumController.getThreadReplyCount(thread);
    ForumMessageUserRESTModel userRestModel = createUserRESTModel(thread.getCreator());
    
    String lock = thread.getLocked() != null ? thread.getLocked().name() : null;
    return new ForumThreadRESTModel(
        thread.getId(), 
        thread.getTitle(), 
        thread.getMessage(), 
        userRestModel, 
        thread.getCreated(), 
        thread.getForumArea().getId(), 
        thread.getSticky(), 
        lock, 
        thread.getLockBy(),
        thread.getLockDate(),
        thread.getUpdated(), 
        numReplies, 
        thread.getLastModified());
  }

  public ForumMessageUserRESTModel createUserRESTModel(Long userId) {
    UserEntity userEntity = userEntityController.findUserEntityById(userId);
    SchoolDataIdentifier userIdentifier = userEntity.defaultSchoolDataIdentifier();
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByIdentifier(userIdentifier);
      
      if (user == null) {
        return null;
      }

      boolean hasPicture = userEntityFileController.hasProfilePicture(userEntity);
      return new ForumMessageUserRESTModel(userEntity.getId(), user.getFirstName(), user.getLastName(), user.getNickName(), hasPicture);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

}
