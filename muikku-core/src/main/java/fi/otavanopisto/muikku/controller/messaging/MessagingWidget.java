package fi.otavanopisto.muikku.controller.messaging;

import java.util.List;

import fi.otavanopisto.muikku.model.users.UserEntity;

public interface MessagingWidget {
  
  public void persistCategory(String category);

  public void postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients);
  
}
