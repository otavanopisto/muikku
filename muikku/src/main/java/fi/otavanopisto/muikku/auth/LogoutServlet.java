package fi.otavanopisto.muikku.auth;

import java.io.IOException;
import java.util.EnumSet;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import fi.otavanopisto.muikku.auth.AuthenticationResult.Status;
import fi.otavanopisto.muikku.events.LogoutEvent;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

  private static final long serialVersionUID = -3642338807691092622L;

  @Inject
  private Logger logger;
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;

  @Inject
  private Event<LogoutEvent> logoutEvent;
  
  @Inject
  private AuthSourceController authSourceController;

  public LogoutServlet() {
    super();
  }

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Long loggedUserEntityId = localSessionController.isLoggedIn() ? localSessionController.getLoggedUserEntity().getId() : null;
    SchoolDataIdentifier loggedUserIdentifier = localSessionController.isLoggedIn() ? localSessionController.getLoggedUser() : null;
    
    String authSource = localSessionController.getAuthSource();
    AuthSource authSourceByStrategy = authSourceController.findAuthSourceByStrategy(authSource);
    AuthenticationProvider authenticationProvider = authSourceController.findAuthenticationProvider(authSourceByStrategy);
    AuthenticationResult authenticationResult = authenticationProvider.processLogout(authSourceByStrategy);
    
    EnumSet<Status> successStates = EnumSet.of(Status.LOGOUT, Status.LOGOUT_WITH_REDIRECT);

    if (successStates.contains(authenticationResult.getStatus())) {
      String redirectTo = authenticationResult.getStatus() == Status.LOGOUT_WITH_REDIRECT ? authenticationResult.getRedirectUrl() : "/";

      localSessionController.logout();
    
      HttpSession session = request.getSession();
      if (session != null) {
        try {
          session.invalidate();
        } catch (Exception e) {
          logger.log(Level.SEVERE, "Failed to invalidate http session", e);
        }
      }

      logoutEvent.fire(new LogoutEvent(loggedUserEntityId, loggedUserIdentifier));

      response.sendRedirect(redirectTo);
    } else {
      logger.log(Level.WARNING, String.format("Logging off failed as status %s isn't in success states.", authenticationResult.getStatus()));
      response.sendRedirect(NavigationRules.INTERNAL_ERROR);
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }

}
