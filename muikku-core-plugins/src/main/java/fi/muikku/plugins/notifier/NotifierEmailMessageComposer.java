package fi.muikku.plugins.notifier;

public interface NotifierEmailMessageComposer {

  String getEmailSubject();
  String getEmailContent();
  
}
