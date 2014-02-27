package fi.muikku.plugins.user;

import java.text.MessageFormat;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.controller.EnvironmentSettingsController;
import fi.muikku.i18n.LocaleController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEntity;
import fi.muikku.session.SessionController;

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

  public UserPendingEmailChange createUserEmailChange() {
    UserEntity userEntity = sessionController.getUser();

    UserPendingEmailChange pendingEmailChange = userInfoController.createEmailChange(userEntity, newEmail);
    
    String from = environmentSettingsController.getSystemEmailSenderAddress();
    String subject = localeController.getText(sessionController.getLocale(), "plugin.userinfo.createUserEmailChange.mail.subject");
    String content = localeController.getText(sessionController.getLocale(), "plugin.userinfo.createUserEmailChange.mail.content");
    String confirmationLink = environmentSettingsController.getBaseUrl() + "/confirmEmailChange?h=" + pendingEmailChange.getConfirmationHash();
    content = MessageFormat.format(content, confirmationLink);
    
    mailer.sendMail(from, newEmail, subject, content);
    
    return pendingEmailChange;
  }
  
  public String getNewEmail() {
    return newEmail;
  }

  public void setNewEmail(String newEmail) {
    this.newEmail = newEmail;
  }

  private String newEmail;
}
