package fi.muikku.plugins.logout;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import fi.muikku.events.LogoutEvent;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

@Named
@Stateful
@RequestScoped  
public class LogoutWidgetBackingBean {
  
  @Inject
  private Logger logger;
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private Event<LogoutEvent> logoutEvent;
  
  @Inject
  private HttpServletRequest request;
  
  public void logout() {
    localSessionController.logout();
    logoutEvent.fire(new LogoutEvent());
    
    HttpSession session = request.getSession();
    if (session != null) {
      try {
        session.invalidate();
      } catch (Exception e) {
        logger.log(Level.SEVERE, "Failed to invalidate http session", e);
      }
    }
    
  }
  
}
