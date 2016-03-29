package fi.otavanopisto.muikku.plugins.login;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.auth.AuthSourceController;
import fi.otavanopisto.muikku.model.security.AuthSource;

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
