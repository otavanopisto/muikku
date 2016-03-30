package fi.otavanopisto.muikku.plugins.notifier.email;

import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.EnvironmentSettingsController;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.notifier.NotifierAction;
import fi.otavanopisto.muikku.notifier.NotifierContext;
import fi.otavanopisto.muikku.notifier.NotifierMethod;
import fi.otavanopisto.muikku.users.UserEmailEntityController;

public class NotifierEmailMethod implements NotifierMethod {

  @Inject
  private Mailer mailer;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private Instance<NotifierEmailMessageComposer> emailMessageComposer;
  
  @Override
  public String getName() {
    return "email";
  }

  @Override
  public String getDisplayName() {
    // TODO: localize
    return "Email";
  }

  @Override
  public void sendNotification(NotifierAction action, NotifierContext context) {
    NotifierEmailMessageComposer message = emailMessageComposer.select(new NotifierEmailContentAnnotationLiteral(action.getName())).get();

    if (message != null) {
      List<String> addresses = userEmailEntityController.listAddressesByUserEntity(context.getRecipient());
      
      mailer.sendMail(message.getEmailMimeType(context), environmentSettingsController.getSystemEmailSenderAddress(), addresses, message.getEmailSubject(context), message.getEmailContent(context));
    }
  }

  @Override
  public boolean isSupported(NotifierAction action) {
    return !emailMessageComposer.select(new NotifierEmailContentAnnotationLiteral(action.getName())).isUnsatisfied();
  }

  
}
