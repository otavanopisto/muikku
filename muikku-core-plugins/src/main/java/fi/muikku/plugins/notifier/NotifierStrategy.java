package fi.muikku.plugins.notifier;

import fi.muikku.model.users.UserEntity;

public interface NotifierStrategy {

  String getName();
  
  String getDisplayName();

  void sendNotification(NotifierAction action, UserEntity sender, UserEntity recipient);
  
  boolean isSupported(NotifierAction action);
}
