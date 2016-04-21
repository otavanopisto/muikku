package fi.otavanopisto.muikku.plugins.forgotpassword;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.jsf.NavigationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.session.SessionController;
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
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Inject
  private ForgotPasswordController forgotPasswordController;
  
  @Inject
  private NavigationController navigationController;
  
  @RequestAction
  public String init() {
    if (!forgotPasswordController.isValidPasswordChangeHash(urlHash)) {
      return navigationController.accessDenied();
    }
    
    if (sessionController.isLoggedIn()) {
      // Already logged in...
      return "/index.jsf?faces-redirect=true";
    }
    
    username = forgotPasswordController.getUsername(urlHash);
    
    return null;
  }
  
  public String savePassword() {
    try {
      if (!forgotPasswordController.isValidPasswordChangeHash(urlHash)) {
        return navigationController.accessDenied();
      }
      
      if (getPassword1().equals(getPassword2())) {
        schoolDataBridgeSessionController.startSystemSession();
        try {
          if (!forgotPasswordController.resetPassword(urlHash, getPassword1())) {
            FacesUtils.addPostRedirectMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChangeFailed"));
          } else {
            FacesUtils.addPostRedirectMessage(FacesMessage.SEVERITY_INFO, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChanged"));
          }
        } finally {
          schoolDataBridgeSessionController.endSystemSession();
        }
        
        return "/index.jsf?faces-redirect=true";
      } else {
        FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordMismatch"));
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Password recovery failed with hash " + urlHash, ex);
      FacesUtils.addMessage(FacesMessage.SEVERITY_WARN, localeController.getText(sessionController.getLocale(), "plugin.forgotpassword.resetPassword.passwordChangeFailed"));
    }
    
    return null;
  }
  
  public String getUsername() {
    return username;
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

  private String username;
  private String password1;
  private String password2;  
}
