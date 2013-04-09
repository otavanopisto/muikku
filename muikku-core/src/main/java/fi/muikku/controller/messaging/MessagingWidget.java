package fi.muikku.controller.messaging;

import java.util.List;

import fi.muikku.model.stub.users.UserEntity;

public interface MessagingWidget {

  public void postMessage(UserEntity sender, String subject, String content, List<UserEntity> recipients);
  
}
