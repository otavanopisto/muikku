package fi.muikku.plugins.logout;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class LogoutWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  public void logout() {
    localSessionController.logout();
  }
  
}
