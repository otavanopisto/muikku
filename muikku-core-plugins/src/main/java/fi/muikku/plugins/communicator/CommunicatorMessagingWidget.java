package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;

@ApplicationScoped
public class CommunicatorMessagingWidget implements MessagingWidget {

  @Inject
  private CommunicatorController communicatorController;

  public void persistCategory(String category) {
    communicatorController.persistCategory(category);
  }
  
  @Override
  public void postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients) {
    CommunicatorMessageId communicatorMessageId = communicatorController.createMessageId();
    
    // TODO Category not existing at this point would technically indicate an invalid state 
    CommunicatorMessageCategory categoryEntity = communicatorController.persistCategory(category);
    
    communicatorController.createMessage(communicatorMessageId, sender, recipients, categoryEntity, subject, content, null);
  }

}
