package fi.muikku.plugins.user;

import java.io.FileNotFoundException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.plugins.internalauth.InternalAuthController;
import fi.muikku.schooldata.UserController;

@Named
@Stateful
@RequestScoped
@URLMappings(mappings = {
  @URLMapping(
    id = "user-changepassword", 
    pattern = "/user-changepassword", 
    viewId = "/user/user-changepassword.jsf"
  )    
})
public class UserChangePasswordBackingBean {

	@Inject
	private UserController userController;
	
	@Inject
	private InternalAuthController internalAuthController;

	@URLAction
	public void init() throws FileNotFoundException {
	}

	public void changePassword() {
	  if (newPasswordHash != null) {
	    if (newPasswordHash.equals(newPasswordHashAgain)) {
	      internalAuthController.
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
