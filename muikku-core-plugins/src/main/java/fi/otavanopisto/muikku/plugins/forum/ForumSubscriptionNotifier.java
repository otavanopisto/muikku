package fi.otavanopisto.muikku.plugins.forum;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import javax.ejb.AccessTimeout;
import javax.ejb.Asynchronous;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.plugins.forum.events.ForumMessageSent;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThreadReply;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumAreaSubscription;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Singleton
public class ForumSubscriptionNotifier {
 
  @Inject
  private ForumThreadNewMessageNotification forumThreadNewMessageNotification;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private NotifierController notifierController;
  
  @Inject
  private ForumController forumController;
  
  @Inject
  private ForumThreadSubsciptionController forumThreadSubsciptionController;
  
  @Inject
  private ForumAreaSubsciptionController forumAreaSubsciptionController;
  
  @Asynchronous
  @AccessTimeout(value = 30, unit = TimeUnit.MINUTES)
  @Transactional (value = TxType.REQUIRES_NEW)
  public void onForumMessageSent(@Observes (during = TransactionPhase.AFTER_COMPLETION) ForumMessageSent event) {
    ForumArea forumArea = forumController.getForumArea(event.getAreaId());
    List<ForumAreaSubscription> areaSubscriptions = null;
    
    if (forumArea != null) {
      areaSubscriptions = forumAreaSubsciptionController.listByArea(forumArea);
    }
    

    ForumThreadReply forumThreadReply = forumController.getForumThreadReply(event.getReplyId());
    
    ForumThread forumThread = forumController.getForumThread(event.getThreadId());
    UserEntity poster = userEntityController.findUserEntityById(event.getPosterUserEntityId());
    
    String content = null;

    if (areaSubscriptions != null) {
      for (ForumAreaSubscription areaSubscription : areaSubscriptions) {
        Long userId = areaSubscription.getUser();
        
        UserEntity recipient = userEntityController.findUserEntityById(userId);

        ForumThreadSubscription forumThreadSubscription = forumThreadSubsciptionController.findByThreadAndUserEntity(forumThread, recipient);
        
        // if a user has subscribed to both forum area and a forum thread in same area, don't send notification via area because the user gets notified via thread instead
        if (forumThreadSubscription != null) {
          continue;
        }
        
        if ((poster != null) && (recipient != null)) {
          if (!Objects.equals(poster.getId(), recipient.getId())) {
            
            if (forumThreadReply != null) {
              content = forumThreadReply.getMessage();
            } else {
              content = forumThread.getMessage();
            }
            
            Map<String, Object> params = new HashMap<String, Object>();
            User senderUser = userController.findUserByUserEntityDefaults(poster);
            params.put("sender", String.format("%s", senderUser.getDisplayName()));
            params.put("subject", forumThread.getTitle());
            params.put("content", content);
            if (event.getWorkspaceUrlName() != null) {
              params.put("url", String.format("%s/workspace/%s/discussions#" + forumArea.getId(), event.getBaseUrl(), event.getWorkspaceUrlName()));

            } else {
              params.put("url", String.format("%s/discussion#" + forumArea.getId(), event.getBaseUrl()));
            }
            notifierController.sendNotification(forumThreadNewMessageNotification, poster, recipient, params);
          }
      }
      }
    }
    
    List<ForumThreadSubscription> threadSubscriptions = forumThreadSubsciptionController.listByThread(forumThread);
    
    if (threadSubscriptions != null) {
      for (ForumThreadSubscription threadSubscription : threadSubscriptions) {
        Long userId = threadSubscription.getUser();
        
        UserEntity recipient = userEntityController.findUserEntityById(userId);

        if ((forumThread != null) && (poster != null) && (recipient != null)) {
          if (!Objects.equals(poster.getId(), recipient.getId())) {
            if (forumThreadReply != null) {
              content = forumThreadReply.getMessage();
            } else {
              content = forumThread.getMessage();
            }
            
            Map<String, Object> params = new HashMap<String, Object>();
            User senderUser = userController.findUserByUserEntityDefaults(poster);
            params.put("sender", String.format("%s", senderUser.getDisplayName()));
            params.put("subject", forumThread.getTitle());
            params.put("content", content);
            
            if (event.getWorkspaceUrlName() != null) {
              params.put("url", String.format("%s/workspace/%s/discussions#" + forumArea.getId() + "/1/" + forumThread.getId(), event.getBaseUrl(), event.getWorkspaceUrlName()));

            } else {
              params.put("url", String.format("%s/discussion#" + forumArea.getId() + "/1/" + forumArea.getId() + "/" + forumThread.getId(), event.getBaseUrl()));
            }
            notifierController.sendNotification(forumThreadNewMessageNotification, poster, recipient, params);
          }
        }
      }
    } 
  }
  
}
