package fi.otavanopisto.muikku.plugins.forum;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

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
import fi.otavanopisto.muikku.plugins.forum.events.ForumThreadMessageSent;
import fi.otavanopisto.muikku.plugins.forum.model.ForumThread;
import fi.otavanopisto.muikku.plugins.forum.wall.ForumThreadSubscription;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Singleton
public class ForumThreadSubscriptionNotifier {

  @Inject
  private Logger logger;
 
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
  
  @Asynchronous
  @AccessTimeout(value = 30, unit = TimeUnit.MINUTES)
  @Transactional (value = TxType.REQUIRES_NEW)
  public void onForumThreadMessageSent(@Observes (during = TransactionPhase.AFTER_COMPLETION) ForumThreadMessageSent event) {
    ForumThread forumThread = forumController.getForumThread(event.getThreadId());
    UserEntity poster = userEntityController.findUserEntityById(event.getPosterUserEntityId());
    
    List<ForumThreadSubscription> subscriptions = forumThreadSubsciptionController.listByThread(forumThread);
    
    if (subscriptions != null) {
      for (ForumThreadSubscription subscription : subscriptions) {
        Long userId = subscription.getUser();
        
        UserEntity recipient = userEntityController.findUserEntityById(userId);

        if ((forumThread != null) && (poster != null) && (recipient != null)) {
          if (!Objects.equals(poster.getId(), recipient.getId())) {
            Map<String, Object> params = new HashMap<String, Object>();
            User senderUser = userController.findUserByUserEntityDefaults(poster);
            params.put("sender", String.format("%s", senderUser.getDisplayName()));
            params.put("subject", forumThread.getTitle());
            params.put("content", forumThread.getMessage());
            params.put("url", String.format("%s/discussion", event.getBaseUrl()));
            //TODO Hash paramters cannot be utilized in redirect URLs
            //params.put("url", String.format("%s/communicator#inbox/%d", baseUrl, message.getCommunicatorMessageId().getId()));
            
            notifierController.sendNotification(forumThreadNewMessageNotification, poster, recipient, params);
          }
      }
    }
    
    } else {
      logger.log(Level.SEVERE, String.format("Forum couldn't send notifications as some entity was not found"));
    }
  }
  
}
