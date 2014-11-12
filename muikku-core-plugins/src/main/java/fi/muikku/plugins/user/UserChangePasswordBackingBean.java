package fi.muikku.plugins.user;

import java.io.FileNotFoundException;
import java.io.IOException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.component.UIInput;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.digest.DigestUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.i18n.LocaleController;
import fi.muikku.plugins.internalauth.InternalAuthController;
import fi.muikku.session.SessionController;
import fi.muikku.utils.FacesUtils;

@Named
@Stateful
@RequestScoped
@Join (path = "/user-changepassword", to = "/user/user-changepassword.jsf")
public class UserChangePasswordBackingBean {
	
	@Inject
	private InternalAuthController internalAuthController;

	@Inject
	private SessionController sessionController;
	
	@Inject
	private LocaleController localeController;
	
	@RequestAction
	public void init() throws FileNotFoundException {
	}

	public void changePassword() {
	  if (newPasswordHash != null) {
	    if (newPasswordHash.equals(newPasswordHashAgain)) {
	      if (internalAuthController.confirmUserPassword(sessionController.getLoggedUserEntity(), passwordHash)) {
	        internalAuthController.updateUserPassword(sessionController.getLoggedUserEntity(), passwordHash, newPasswordHash);

          FacesUtils.addPostRedirectMessage(FacesMessage.SEVERITY_INFO, localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.passwordChanged"));
          ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
          try {
            context.redirect(context.getRequestContextPath());
          }
          catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
          }
	      }
	    }
	  }
	}

	public void validateOldPassword(FacesContext context, UIComponent component, Object value) {
    String passwordHash = (String) value;
    
    if(!internalAuthController.confirmUserPassword(sessionController.getLoggedUserEntity(), passwordHash)) {
      FacesMessage message = new FacesMessage();
      message.setSeverity(FacesMessage.SEVERITY_ERROR);
      message.setSummary(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.invalidOldPasswordSummary"));
      message.setDetail(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.invalidOldPasswordDetail"));
      context.addMessage("chPw:p1", message);
      throw new ValidatorException(message);
    }	  
	}

  public void validateNewPasswords(FacesContext context, UIComponent component, Object value) {
    UIInput sd = (UIInput) component.getAttributes().get("p2");
    String newPasswordHash = (String) sd.getValue();    
    String newPasswordHashAgain = (String) value;
    String emptyHash = DigestUtils.md5Hex("");

    if(!newPasswordHash.equals(newPasswordHashAgain)) {
      FacesMessage message = new FacesMessage();
      message.setSeverity(FacesMessage.SEVERITY_ERROR);
      message.setSummary(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.newPasswordMismatchSummary"));
      message.setDetail(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.newPasswordMismatchDetail"));
      context.addMessage("chPw:p3", message);
      throw new ValidatorException(message);
    } else {
      if(emptyHash.equals(newPasswordHash)) {
        FacesMessage message = new FacesMessage();
        message.setSeverity(FacesMessage.SEVERITY_ERROR);
        message.setSummary(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.emptyPasswordSummary"));
        message.setDetail(localeController.getText(sessionController.getLocale(), "plugin.userinfo.changePassword.emptyPasswordDetail"));
        context.addMessage("chPw:p2", message);
        throw new ValidatorException(message);
      } 
    }
  }
	
	public String getPasswordHash() {
    return passwordHash;
  }

	public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getNewPasswordHash() {
    return newPasswordHash;
  }

  public void setNewPasswordHash(String newPasswordHash) {
    this.newPasswordHash = newPasswordHash;
  }

  public String getNewPasswordHashAgain() {
    return newPasswordHashAgain;
  }

  public void setNewPasswordHashAgain(String newPasswordHashAgain) {
    this.newPasswordHashAgain = newPasswordHashAgain;
  }

  private String passwordHash;
	private String newPasswordHash;
	private String newPasswordHashAgain;
}
