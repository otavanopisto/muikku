package fi.otavanopisto.muikku.plugins.forum;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscriptionDAO;

public class ForumThreadSubsciptionController {

  @Inject
  private ForumThreadSubscriptionDAO forumThreadSubscriptionDAO;

  
  public ForumThreadSubscription createForumThreadSubsciption(ForumThread forumThread, UserEntity userEntity) {
    return forumThreadSubscriptionDAO.create(userEntity, forumThread);
  }
  
  public ForumThreadSubscription findByThreadAndUserEntity(ForumThread forumThread, UserEntity userEntity) {
    return forumThreadSubscriptionDAO.findByUserAndForumThread(userEntity, forumThread);
  }
  
  public void deleteSubscription(ForumThreadSubscription forumThreadSubscription) {
    forumThreadSubscriptionDAO.delete(forumThreadSubscription);
  }
  
  public List<ForumThreadSubscription> listByThread(ForumThread forumThread){
    return forumThreadSubscriptionDAO.listByThread(forumThread);
  }
  
  public List<ForumThreadSubscription> listByUser(UserEntity userEntity){
    return forumThreadSubscriptionDAO.listByUser(userEntity);
  }
  
}
