package fi.otavanopisto.muikku.plugins.notifier.email;

import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.notifier.NotifierAction;
import fi.otavanopisto.muikku.notifier.NotifierContext;
import fi.otavanopisto.muikku.notifier.NotifierMethod;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.UserEmailEntityController;

@ApplicationScoped
public class NotifierEmailMethod implements NotifierMethod {

  @Inject
  private Mailer mailer;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
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
      // List email addresses of user entity (only default identifier)
      UserEntity userEntity = context.getRecipient();
      SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();
      List<String> addresses = userEmailEntityController.getUserEmailAddresses(identifier).stream().map(UserEmailEntity::getAddress).collect(Collectors.toList());;
      if (CollectionUtils.isNotEmpty(addresses)) {
        mailer.sendMail(message.getEmailMimeType(context), systemSettingsController.getSystemEmailSenderAddress(), addresses, message.getEmailSubject(context), message.getEmailContent(context));
      }
    }
  }

  @Override
  public boolean isSupported(NotifierAction action) {
    return !emailMessageComposer.select(new NotifierEmailContentAnnotationLiteral(action.getName())).isUnsatisfied();
  }

  
}
