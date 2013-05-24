package fi.muikku.plugins.internallogin;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class InternalLoginWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  public void login() {
    localSessionController.login(email, password);
  }
  
  public String getEmail() {
    return email;
  }
  
  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  private String email;
  private String password;
  
}
