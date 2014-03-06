package fi.muikku.plugins.forgotpassword;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.digest.DigestUtils;

import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.controller.UserEntityController;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest;
import fi.muikku.plugins.internalauth.InternalAuthController;
import fi.muikku.session.SessionController;
import fi.muikku.utils.FacesUtils;

@Named
@Stateful
@RequestScoped  
@URLMappings (
  mappings = @URLMapping(
    viewId = "/forgotpassword/reset.jsf",
    pattern = "/forgotpassword/reset",
    id = "forgotpassword-reset"
  )     
)
public class ResetPasswordBackingBean {

  @URLQueryParameter ("h")
  private String urlHash;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private ForgotPasswordController forgotPasswordController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private InternalAuthController internalAuthController;
  
  public void savePassword() {
    long userEntityId;
    PasswordResetRequest passwordResetRequest = forgotPasswordController.findPasswordResetRequestByResetHash(urlHash);
    if (passwordResetRequest != null) {
      UserEntity userEntity = userEntityController.findUserById(passwordResetRequest.getUserEntityId());
      if (userEntity != null) {
        userEntityId = userEntity.getId();
        if (getPassword1().equals(getPassword2())) {
          String hashed = DigestUtils.md5Hex(getPassword1());
          hashed = DigestUtils.md5Hex(hashed);
          internalAuthController.updateUserEntityPassword(userEntityId, hashed);
          FacesUtils.addMessage(FacesMessage.SEVERITY_INFO, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChanged"));
        }
        else {
          FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordMismatch"));
        }
      }
    }
    else {
      // TODO invalid URL hash
    }
  }
  
  public String getPassword1() {
    return password1;
  }

  public void setPassword1(String password1) {
    this.password1 = password1;
  }

  public String getPassword2() {
    return password2;
  }

  public void setPassword2(String password2) {
    this.password2 = password2;
  }
  
  public String getUrlHash() {
    return urlHash;
  }

  public void setUrlHash(String urlHash) {
    this.urlHash = urlHash;
  }

  private String password1;
  private String password2;  
}
