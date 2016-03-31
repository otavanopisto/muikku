package fi.otavanopisto.muikku.notifier;


public interface NotifierMethod {

  String getName();
  
  String getDisplayName();

  void sendNotification(NotifierAction action, NotifierContext context);
  
  boolean isSupported(NotifierAction action);
}
