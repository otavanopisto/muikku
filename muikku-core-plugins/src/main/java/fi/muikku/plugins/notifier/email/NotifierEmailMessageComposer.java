package fi.muikku.plugins.notifier.email;

import fi.muikku.mail.MailType;
import fi.muikku.notifier.NotifierContext;

public interface NotifierEmailMessageComposer {

  String getEmailSubject(NotifierContext context);
  String getEmailContent(NotifierContext context);
  MailType getEmailMimeType(NotifierContext context);
  
}
