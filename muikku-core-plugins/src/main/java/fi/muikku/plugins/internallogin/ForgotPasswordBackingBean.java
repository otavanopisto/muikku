package fi.muikku.plugins.internallogin;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.deltaspike.core.util.StringUtils;

import fi.muikku.controller.UserEntityController;
import fi.muikku.i18n.LocaleController;
import fi.muikku.mail.Mailer;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.internallogin.model.PasswordResetRequest;
import fi.muikku.servlet.BaseUrl;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped  
public class ForgotPasswordBackingBean {

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private Mailer mailer;

  @Inject
  private InternalLoginController internalLoginController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject 
  @BaseUrl
  String baseUrl;

  /**
   * Method invoked when the user clicks the Send button in the Forgot Password view.
   */
  public void resetPassword() {
    if (StringUtils.isEmpty(email)) {
      // TODO Error handling; user gave no email address at all
    }
    else {
      // TODO Is the email given a valid address?
    }
    UserEntity userEntity = userEntityController.findUserByEmailAddress(email);
    if (userEntity == null) {
      // TODO Error handling; the given email address does not correspond to any user
    }
    else {
      PasswordResetRequest resetRequest = internalLoginController.findPasswordResetRequestByUser(userEntity);
      if (resetRequest == null) {
        resetRequest = internalLoginController.createPasswordResetRequest(userEntity);
      }
      else {
        resetRequest = internalLoginController.updateResetHash(resetRequest);
      }
      // TODO Email could be added to the reset link for added security (email+hash rather than just hash)
      String resetLink = baseUrl + "/forgotpassword/reset.jsf?h=" + resetRequest.getResetHash();
      String mailSubject = localeController.getText(sessionController.getLocale(), "plugin.internalLogin.forgotPassword.mailSubject");
      String mailContent = localeController.getText(sessionController.getLocale(), "plugin.internalLogin.forgotPassword.mailContent", new String[] { resetLink });
      // TODO System sender address needs to be configurable
      mailer.sendMail(null, email, mailSubject, mailContent);
      // TODO Information handling; need to let the user know that the mail has been successfully sent
    }
  }
  
  /**
   * Returns the email of this backing bean.
   * 
   * @return the email of this backing bean
   */
  public String getEmail() {
    return email;
  }
  
  /**
   * Sets the email of this backing bean.
   * 
   * @param email The email of this backing bean
   */
  public void setEmail(String email) {
    this.email = email;
  }

  /** Value holder for the Email Address field of the Forgot Password view */ 
  private String email;

}
