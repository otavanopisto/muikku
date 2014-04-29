package fi.muikku.plugins.notifier.sms;

import fi.muikku.notifier.NotifierAction;
import fi.muikku.notifier.NotifierContext;
import fi.muikku.notifier.NotifierMethod;

public class NotifierSMSMethod implements NotifierMethod {

  @Override
  public String getName() {
    return "sms";
  }

  @Override
  public String getDisplayName() {
    return "SMS";
  }

  @Override
  public void sendNotification(NotifierAction action, NotifierContext context) {
  }

  @Override
  public boolean isSupported(NotifierAction action) {
    return false;
  }

}
