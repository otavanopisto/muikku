package fi.muikku.plugins.communicator;

import fi.muikku.plugins.notifier.NotifierAction;
import fi.muikku.plugins.notifier.NotifierEmailMessageComposer;

public class CommunicatorNewInboxMessageNotification implements NotifierAction, NotifierEmailMessageComposer {

  @Override
  public String getEmailSubject() {
    return "Uusi viesti Muikussa";
  }

  @Override
  public String getEmailContent() {
    return "Uusi viesti Muikussa diipadaapa";
  }

  @Override
  public String getName() {
    return "communicator-inbox-new";
  }

}
