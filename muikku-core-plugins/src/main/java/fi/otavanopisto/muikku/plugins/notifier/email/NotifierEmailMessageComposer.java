package fi.otavanopisto.muikku.plugins.notifier.email;

import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.notifier.NotifierContext;

public interface NotifierEmailMessageComposer {

  String getEmailSubject(NotifierContext context);
  String getEmailContent(NotifierContext context);
  MailType getEmailMimeType(NotifierContext context);
  
}
