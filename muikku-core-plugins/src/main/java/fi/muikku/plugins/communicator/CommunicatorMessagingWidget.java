package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;

@ApplicationScoped
public class CommunicatorMessagingWidget implements MessagingWidget {

  @Inject
  private CommunicatorController communicatorController;
  
  @Override
  public void postMessage(UserEntity sender, String subject, String content, List<UserEntity> recipients) {
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    communicatorController.createMessage(communicatorMessageId, sender, recipients, subject, content, null);
  }

}
