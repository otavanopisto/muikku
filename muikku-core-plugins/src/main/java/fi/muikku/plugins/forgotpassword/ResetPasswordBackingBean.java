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

//  @Inject
//  private LocaleController localeController;
//
//  @Inject
//  private SessionController sessionController;
//
//  @Inject
//  private InternalLoginController internalLoginController;
//
//  @Inject
//  private UserEntityController userEntityController;

  @URLQueryParameter ("h")
  private String hash;

  @URLAction
  public void load() {
    // TODO Does hash point to a valid PasswordResetRequest
    // TODO Figure out UserEntity via PasswordResetRequest. Store reference here?
  }

  public void savePassword() {
    // TODO Compare password1/password2 + update InternalAuth for stored user entity reference
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
}
