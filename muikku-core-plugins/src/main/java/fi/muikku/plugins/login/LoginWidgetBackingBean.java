package fi.muikku.plugins.login;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.auth.AuthSourceController;
import fi.muikku.model.security.AuthSource;

@Named
@Stateful
@RequestScoped
public class LoginWidgetBackingBean {

  @Inject
  private AuthSourceController authSourceController;
 
  public List<AuthSource> getCredentialessAuthSources() {
    return authSourceController.listCredentialessAuthSources();
  }
  
}
