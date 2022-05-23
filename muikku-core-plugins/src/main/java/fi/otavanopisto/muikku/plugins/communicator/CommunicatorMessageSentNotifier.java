package fi.otavanopisto.muikku.plugins.communicator;

import java.util.HashMap;
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
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Singleton
public class CommunicatorMessageSentNotifier {

  @Inject
  private Logger logger;
 
  @Inject
  private CommunicatorNewInboxMessageNotification communicatorNewInboxMessageNotification;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private NotifierController notifierController;
  
  @Asynchronous
  @AccessTimeout(value = 30, unit = TimeUnit.MINUTES)
  @Transactional (value = TxType.REQUIRES_NEW)
  public void onCommunicatorMessageSent(@Observes (during = TransactionPhase.AFTER_COMPLETION) CommunicatorMessageSent event) {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(event.getCommunicatorMessageId());
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    UserEntity recipient = userEntityController.findUserEntityById(event.getRecipientUserEntityId());

    if ((communicatorMessage != null) && (sender != null) && (recipient != null)) {
      if (!Objects.equals(sender.getId(), recipient.getId())) {
        Map<String, Object> params = new HashMap<String, Object>();
        User senderUser = userController.findUserByUserEntityDefaults(sender);
        params.put("sender", String.format("%s", senderUser.getDisplayName()));
        params.put("subject", communicatorMessage.getCaption());
        params.put("content", communicatorMessage.getContent());
        params.put("url", String.format("%s/communicator", event.getBaseUrl()));
        //TODO Hash paramters cannot be utilized in redirect URLs
        //params.put("url", String.format("%s/communicator#inbox/%d", baseUrl, message.getCommunicatorMessageId().getId()));
        
        notifierController.sendNotification(communicatorNewInboxMessageNotification, sender, recipient, params);
      }
    } else {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send notifications as some entity was not found"));
    }
  }
  
}
