package fi.muikku.plugins.logout;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.events.LogoutEvent;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class LogoutWidgetBackingBean {
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private Event<LogoutEvent> logoutEvent;
  
  public void logout() {
    localSessionController.logout();
    logoutEvent.fire(new LogoutEvent());
  }
  
}
