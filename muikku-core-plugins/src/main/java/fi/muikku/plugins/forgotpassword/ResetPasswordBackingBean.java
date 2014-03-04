package fi.muikku.plugins.forgotpassword;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.ws.rs.QueryParam;

import com.ocpsoft.pretty.faces.annotation.URLAction;
import com.ocpsoft.pretty.faces.annotation.URLMappings;
import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLQueryParameter;

import fi.muikku.controller.UserEntityController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forgotpassword.dao.PasswordResetRequestDAO;
import fi.muikku.plugins.forgotpassword.model.PasswordResetRequest;
import fi.muikku.plugins.internalauth.InternalAuthController;

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
  private String hash;
  
  @Inject
  private ForgotPasswordController internalLoginController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private InternalAuthController internalAuthController;
  
  @URLAction
  public void load() {
    PasswordResetRequest passwordResetRequest = internalLoginController.findPasswordResetRequestByResetHash(hash);
    if (passwordResetRequest != null) {
      UserEntity userEntity = userEntityController.findUserById(passwordResetRequest.getUserEntityId());
      if (userEntity != null) {
        userEntityId = userEntity.getId();
      }
    }
  }

  public void savePassword() {
    if (getPassword1().equals(getPassword2())) {
      internalAuthController.updateUserEntityPassword(userEntityId, getPassword1());
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
  
  public String getHash() {
    return hash;
  }
  
  public void setHash(String hash) {
    this.hash = hash;
  }

  private String password1;
  private String password2;  
  private long userEntityId;
}
