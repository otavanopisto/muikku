package fi.otavanopisto.muikku.plugins.forgotpassword;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChange;
import fi.otavanopisto.muikku.plugins.user.UserPendingPasswordChangeDAO;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.utils.FacesUtils;

@Named
@Stateful
@RequestScoped  
@Join (path = "/forgotpassword/reset", to = "/jsf/forgotpassword/reset.jsf")
public class ResetPasswordBackingBean {

  @Parameter ("h")
  private String urlHash;

  @Inject
  private Logger logger;
  
  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private UserPendingPasswordChangeDAO userPendingPasswordChangeDAO;
  
  public void savePassword() {
    try {
      UserPendingPasswordChange passwordChange = userPendingPasswordChangeDAO.findByConfirmationHash(urlHash);
      
      if (passwordChange != null) {
        UserEntity userEntity = userEntityController.findUserEntityById(passwordChange.getUserEntity());

        if (userEntity != null) {
          if (getPassword1().equals(getPassword2())) {
            schoolDataBridgeSessionController.startSystemSession();
            try {
              if (!userSchoolDataController.confirmResetPassword(userEntity.getDefaultSchoolDataSource(), urlHash, getPassword1()))
                FacesUtils.addPostRedirectMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChangeFailed"));
              else
                userPendingPasswordChangeDAO.delete(passwordChange);
            } finally {
              schoolDataBridgeSessionController.endSystemSession();
            }
            
            FacesUtils.addPostRedirectMessage(FacesMessage.SEVERITY_INFO, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChanged"));
            ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
            try {
              String redirectUrl = "/";
              context.redirect(redirectUrl);
            }
            catch (IOException e) {
              // TODO Auto-generated catch block
              e.printStackTrace();
            }
          }
          else {
            FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordMismatch"));
          }
        }
      }
      else {
        FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChangeFailed"));
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Password recovery failed with hash " + urlHash, ex);
      FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChangeFailed"));
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
