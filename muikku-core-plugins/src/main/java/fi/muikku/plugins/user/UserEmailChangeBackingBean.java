package fi.muikku.plugins.user;

import java.text.MessageFormat;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.i18n.LocaleController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
public class UserEmailChangeBackingBean {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserInfoController userInfoController;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private Mailer mailer;

  public UserPendingEmailChange createUserEmailChange(UserEmailEntity userEmailEntity) {
    UserPendingEmailChange pendingEmailChange = userInfoController.createEmailChange(userEmailEntity, newEmail);
    
    String from = environmentSettingsController.getSystemEmailSenderAddress();
    String subject = localeController.getText(sessionController.getLocale(), "plugin.userinfo.createUserEmailChange.mail.subject");
    String content = localeController.getText(sessionController.getLocale(), "plugin.userinfo.createUserEmailChange.mail.content");
    String confirmationLink = environmentSettingsController.getBaseUrl() + "/user-confirmEmailChange/h/" + pendingEmailChange.getConfirmationHash();
    content = MessageFormat.format(content, confirmationLink);
    
    mailer.sendMail(from, newEmail, subject, content);
    
    return pendingEmailChange;
  }

  public boolean hasPendingEmailChange(UserEmailEntity userEmailEntity) {
    return userInfoController.hasPendingEmailChange(userEmailEntity);
  }
  
  public String getNewEmail() {
    return newEmail;
  }

  public void setNewEmail(String newEmail) {
    this.newEmail = newEmail;
  }

  private String newEmail;
}
