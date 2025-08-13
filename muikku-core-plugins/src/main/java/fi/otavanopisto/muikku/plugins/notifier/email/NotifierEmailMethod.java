package fi.otavanopisto.muikku.plugins.notifier.email;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.mail.Mailer;
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
      UserEntity userEntity = context.getRecipient();
      SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();
      if (identifier != null) {
        String address = userEmailEntityController.getUserDefaultEmailAddress(identifier, false);
        if (!StringUtils.isBlank(address)) {
          mailer.sendMail(message.getEmailMimeType(context), address, message.getEmailSubject(context), message.getEmailContent(context));
        }
      }
    }
  }

  @Override
  public boolean isSupported(NotifierAction action) {
    return !emailMessageComposer.select(new NotifierEmailContentAnnotationLiteral(action.getName())).isUnsatisfied();
  }

}
