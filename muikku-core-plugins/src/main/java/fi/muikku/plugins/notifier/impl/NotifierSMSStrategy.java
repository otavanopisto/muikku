package fi.muikku.plugins.notifier.impl;

import fi.muikku.plugins.notifier.NotifierStrategy;

public class NotifierSMSStrategy implements NotifierStrategy {

  @Override
  public void sendNotification() {
  }

  @Override
  public String getName() {
    return "sms";
  }

  @Override
  public String getDisplayName() {
    return "SMS";
  }

}
