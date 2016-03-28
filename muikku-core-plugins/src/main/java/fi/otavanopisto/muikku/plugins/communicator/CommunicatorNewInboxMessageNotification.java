package fi.otavanopisto.muikku.plugins.communicator;

import java.util.Locale;

import javax.enterprise.inject.Default;
import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.notifier.NotifierAction;
import fi.otavanopisto.muikku.notifier.NotifierContext;
import fi.otavanopisto.muikku.plugins.notifier.email.NotifierEmailContent;
import fi.otavanopisto.muikku.plugins.notifier.email.NotifierEmailMessageComposer;

@Default
@NotifierEmailContent(CommunicatorNewInboxMessageNotification.NAME)
public class CommunicatorNewInboxMessageNotification implements NotifierAction, NotifierEmailMessageComposer {
  
  @Inject
  private LocaleController localeController;

  public static final String NAME = "communicator-inbox-new";
  
  @Override
  public String getEmailSubject(NotifierContext context) {
    Locale locale = (Locale) context.getParameter("locale");
    return locale == null ? "Uusi viesti Muikussa" : localeController.getText(locale, "plugin.communicator.notification.newmessage.mail.subject");
  }

  @Override
  public String getEmailContent(NotifierContext context) {
    String messageSender = (String) context.getParameter("sender");
    String messageSubject = (String) context.getParameter("subject");
    String messageContent = (String) context.getParameter("content");
    String messageUrl = (String) context.getParameter("url");
    Locale locale = (Locale) context.getParameter("locale");
    if (messageSender == null || messageSubject == null || messageContent == null || messageUrl == null || locale == null) {
      return "Uusi viesti Muikussa";
    }
    return localeController.getText(
        locale,
        "plugin.communicator.notification.newmessage.mail.content",
        new String[] { messageUrl, messageSender, messageSubject, messageContent });
  }

  @Override
  public MailType getEmailMimeType(NotifierContext context) {
    return MailType.HTML;
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
