package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.VacationNotifications;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;

@ApplicationScoped
public class CommunicatorAutoReplyController {

  @Inject
  private Logger logger;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private SessionController sessionController;
  
  public void createCommunicatorAutoReply(CommunicatorMessage communicatorMessage, UserEntity recipient) {
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    UserEntityProperty autoReply = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply");

    if (autoReply == null) {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send automatic reply as user entity property 'communicator-auto-reply' was not found"));
      return;
    }
    
    if (sender == null || recipient == null) {
      logger.log(Level.SEVERE, String.format("Communicator couldn't send automatic reply as user entity was not found"));
      return;
    }
    if (!Objects.equals(sender.getId(), recipient.getId())) {

      if (StringUtils.equals(autoReply.getValue(), "ENABLED")) {
        UserEntityProperty startProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-start");
        UserEntityProperty endProperty = userEntityController.getUserEntityPropertyByKey(recipient, "profile-vacation-end");
    
        LocalDate start = null;
        LocalDate end = null;
        
        if (startProperty == null || endProperty == null) {
          // #5629: Simply don't send message if start/end properties aren't present
          return;
        }
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ENGLISH);
        start = LocalDate.parse(startProperty.getValue(), formatter);
        end = LocalDate.parse(endProperty.getValue(), formatter);
        
        if (start == null || end == null) {
          // #5629: Simply don't send message if start/end dates cannot be parsed
          return;
        }
        
        LocalDate now = LocalDate.now();
        Date notificationDate = new Date();
        if (start.equals(now) || (now.isAfter(start) && now.isBefore(end)) || end.equals(now)) {
          DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd.MM.yyy", Locale.ENGLISH);
          String startDate = outputFormatter.format(start);
          String endDate = outputFormatter.format(end);
          
          String replyMessage = "";    
          String replySubject = "";
          UserEntityProperty autoReplyMsg = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply-msg");
          UserEntityProperty autoReplySubject = userEntityController.getUserEntityPropertyByKey(recipient, "communicator-auto-reply-subject");
          
          if (autoReplyMsg != null) {
            replyMessage = autoReplyMsg.getValue();
          }
          else {
            replyMessage = localeController.getText(sessionController.getLocale(), "plugin.communicator.autoreply", new String[] { startDate,endDate});
          }
          if (autoReplySubject != null) {
            replySubject = autoReplySubject.getValue();
          }
          else {
            replySubject = localeController.getText(sessionController.getLocale(), "plugin.communicator.autoreply", new String[] { startDate,endDate});
          }

          CommunicatorMessageRecipientList recipientsList = new CommunicatorMessageRecipientList();
          recipientsList.addRecipient(sender);

          VacationNotifications vacationNotification = communicatorController.findVacationNotification(sender, recipient);
          
          if (vacationNotification != null) {
            Date lastNotification = vacationNotification.getNotificationDate();
            
            Date today = new Date();
            Calendar c = Calendar.getInstance();
            c.setTime(lastNotification);
            c.add(Calendar.DATE, 4);
            if (today.after(c.getTime())) {
              communicatorController.updateVacationNotificationDate(vacationNotification, notificationDate);
              CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
              CommunicatorMessageCategory category = communicatorController.persistCategory("autoVacationReply");
              communicatorController.createMessage(communicatorMessageId, recipient, recipientsList, category, replySubject, replyMessage, null);
            }
          } else {
            communicatorController.createVacationNotification(sender, recipient, notificationDate);
            CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
            CommunicatorMessageCategory category = communicatorController.persistCategory("autoVacationReply");
            communicatorController.createMessage(communicatorMessageId, recipient, recipientsList, category, replySubject, replyMessage, null);
          }
        }
      }
    }
  }
}
