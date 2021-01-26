package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
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

import org.jsoup.select.Evaluator.IsEmpty;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.notifier.NotifierController;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Singleton
public class CommunicatorAutoReply {

  @Inject
  private Logger logger;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private UserEntityController userEntityController;
  
  public void onCommunicatorAutoReply(Long message, Long recipientId) {
    CommunicatorMessage communicatorMessage = communicatorController.findCommunicatorMessageById(message);
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    UserEntity recipient = userEntityController.findUserEntityById(recipientId);

    UserEntityProperty autoReplyMsg = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply-msg");
    UserEntityProperty autoReply = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply");


    if ((communicatorMessage != null) && (sender != null) && (recipient != null)) {
      if (!Objects.equals(sender.getId(), recipient.getId())) {

        if (autoReply != null) {
          Boolean isAutoReplyOn = Boolean.parseBoolean(autoReply.getValue());
          
          if (Boolean.TRUE.equals(isAutoReplyOn)) {
            String startProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-start").getValue();
            String endProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-end").getValue();
  
            LocalDate start = null;
            LocalDate end = null;
            String replyMessage = "";    
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
            start = LocalDate.parse(startProperty, formatter);
                
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
            end = LocalDate.parse(endProperty, formatter);
              
            if (start != null && end != null) {  
              LocalDate now = LocalDate.now();    
              if (start.equals(now) || (now.isAfter(start) && now.isBefore(end)) || end.equals(now)) {
                if (autoReplyMsg != null) {
                  replyMessage = autoReplyMsg.getValue();
                } else {
                  replyMessage = "Automaattinen poissaoloviesti tähän.";
                }
                List<UserEntity> recipientsList = new ArrayList<UserEntity>();
                recipientsList.add(sender);
                communicatorController.replyToMessage(recipient, communicatorMessage.getCategory().getName(), "Automaattinen vastaus: En ole paikalla ", replyMessage, recipientsList, communicatorMessage.getCommunicatorMessageId());
              }
            }
          }
        }
      }
    } else {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send notifications as some entity was not found"));
    }
  }
  
}
