package fi.muikku.plugins.communicator;

import javax.enterprise.inject.Default;

import fi.muikku.notifier.NotifierAction;
import fi.muikku.notifier.NotifierContext;
import fi.muikku.plugins.notifier.email.NotifierEmailContent;
import fi.muikku.plugins.notifier.email.NotifierEmailMessageComposer;

@Default
@NotifierEmailContent(CommunicatorNewInboxMessageNotification.NAME)
public class CommunicatorNewInboxMessageNotification implements NotifierAction, NotifierEmailMessageComposer {

  public static final String NAME = "communicator-inbox-new";
  
  @Override
  public String getEmailSubject(NotifierContext context) {
    return "Uusi viesti Muikussa";
  }

  @Override
  public String getEmailContent(NotifierContext context) {
    return "Uusi viesti Muikussa";
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public String getDisplayName() {
    return "Viestin - Uusi viesti";
  }

}
