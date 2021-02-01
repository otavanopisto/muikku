package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Singleton;
import javax.inject.Inject;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.VacationNotifications;
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
    UserEntityProperty autoReplySubject = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply-subject");
    UserEntityProperty autoReply = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply");


    if ((communicatorMessage != null) && (sender != null) && (recipient != null)) {
      if (!Objects.equals(sender.getId(), recipient.getId())) {

        if (autoReply != null) {
          
          if (autoReply.getValue().equals("ENABLED")) {
            UserEntityProperty startProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-start");
            UserEntityProperty endProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-end");
  
            LocalDate start = null;
            LocalDate end = null;
            String replyMessage = "";    
            String replySubject = "";
            
            if (startProperty != null && endProperty != null) {
              DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
              start = LocalDate.parse(startProperty.getValue(), formatter);
              end = LocalDate.parse(endProperty.getValue(), formatter);
            }
            if (start != null && end != null) {  
              LocalDate now = LocalDate.now();
              Date notificationDate = new Date();
              if (start.equals(now) || (now.isAfter(start) && now.isBefore(end)) || end.equals(now)) {
                
                DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd.MM.yyy", Locale.ENGLISH);
                String startDate = outputFormatter.format(start);
                String endDate = outputFormatter.format(end);
                
                if (autoReplyMsg != null) {
                  replyMessage = autoReplyMsg.getValue();
                } else {
                  replyMessage = "Automaattinen vastaus: Poissa " + startDate + " - " + endDate;
                }
                if (autoReplySubject != null) {
                  replySubject = autoReplySubject.getValue();
                } else {
                  replySubject = "Automaattinen vastaus: Poissa " + startDate + " - " + endDate;
                }
                List<UserEntity> recipientsList = new ArrayList<UserEntity>();
                recipientsList.add(sender);
                VacationNotifications vacationNotification = communicatorController.findVacationNotification(sender, recipient);
                
                if (vacationNotification != null) {
                  Date lastNotification = vacationNotification.getNotificationDate();

                  LocalDate lastPlusFour = lastNotification.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                  lastPlusFour = lastPlusFour.plusDays(4);
                  Date fourDays = java.sql.Date.valueOf(lastPlusFour);

                  if (java.sql.Date.valueOf(now).after(fourDays)) {
                    communicatorController.createVacationNotification(sender, recipient, notificationDate);
                    communicatorController.replyToMessage(recipient, communicatorMessage.getCategory().getName(), replySubject, replyMessage, recipientsList, communicatorMessage.getCommunicatorMessageId());
                  }
                } else {
                  communicatorController.createVacationNotification(sender, recipient, notificationDate);
                  communicatorController.replyToMessage(recipient, communicatorMessage.getCategory().getName(), replySubject, replyMessage, recipientsList, communicatorMessage.getCommunicatorMessageId());
                }
              }
            }
          }
        }
      }
    } else {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send automatic reply as some entity was not found"));
    }
  }
  
}
