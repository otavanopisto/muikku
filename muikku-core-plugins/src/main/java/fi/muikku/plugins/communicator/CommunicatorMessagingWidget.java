package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.messaging.MessagingWidget;
import fi.muikku.model.users.UserEntity;

@ApplicationScoped
public class CommunicatorMessagingWidget implements MessagingWidget {

  @Inject
  private CommunicatorController communicatorController;

  public void persistCategory(String category) {
    communicatorController.persistCategory(category);
  }
  
  @Override
  public void postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients) {
    communicatorController.postMessage(sender, category, subject, content, recipients);
  }

}
