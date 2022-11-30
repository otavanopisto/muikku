
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.auth.AuthSourceController;
import fi.otavanopisto.muikku.auth.AuthenticationProvider;
import fi.otavanopisto.muikku.auth.AuthenticationResult;
import fi.otavanopisto.muikku.auth.LoginSessionBean;
import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;

  @Inject
  private Logger logger;
  
  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  private AuthSourceController authSourceController;
  
  @Inject
  private LoginSessionBean loginSessionBean;

  public LoginServlet() {
    super();
  }

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
      Map<String, String[]> requestParameters = request.getParameterMap();

      Long authSourceId = null;
      String redirectUrl = null;

      if (authSourceId == null) {
        authSourceId = loginSessionBean.getAuthSourceId();
      } else {
        loginSessionBean.setAuthSourceId(authSourceId);
      }

      if (StringUtils.isNotBlank(redirectUrl)) {
        loginSessionBean.setPostLoginRedirectUrl(redirectUrl);
      }
      
      if (authSourceId == null) {
        // authentication source id is not defined, which means that we need to ask the user which he or she is 
        // going to use, unless only one source is defined and it's credentialess one, in which case we use that one.
  
        List<AuthSource> credentialAuthSources = authSourceController.listCredentialAuthSources();
        List<AuthSource> credentialessAuthSources = authSourceController.listCredentialessAuthSources();
        
        if (credentialAuthSources.isEmpty() && credentialessAuthSources.size() == 1) {
          authSourceId = credentialessAuthSources.get(0).getId();
        }
      }
      
      if (authSourceId != null) {
        AuthSource authSource = authSourceController.findAuthSourceById(authSourceId);
        if (authSource != null) {
          AuthenticationProvider authenticationProvider = authSourceController.findAuthenticationProvider(authSource);
          if (authenticationProvider != null) {
            
            AuthenticationResult result = authenticationProvider.processLogin(authSource, requestParameters);
            if (StringUtils.isNotBlank(result.getRedirectUrl())) {
              response.sendRedirect(result.getRedirectUrl());
            } else {
              loginSessionBean.setAuthSourceId(null);
              String postLoginRedirectUrl = loginSessionBean.getPostLoginRedirectUrl();
              
              switch (result.getStatus()) {
                case GRANT:
                  // User granted additional scopes in existing authentication source 
                break;
                case LOGIN:
                  // User logged in
                break;
                case NEW_ACCOUNT:
                  // User created new account
                break;
                case CONFLICT:
                  switch (result.getConflictReason()) {
                    case EMAIL_BELONGS_TO_ANOTHER_USER:
                      // Could not login, one or more of the email addresses belong to another user
                    break;
                    case LOGGED_IN_AS_DIFFERENT_USER:
                      // Could not login, user is already logged in as a another user
                    break;
                    case SEVERAL_USERS_BY_EMAILS:
                      // Could not login, several users found by email addresses
                    break;
                  }         

                  logger.log(Level.SEVERE, String.format("Authentication failed on with following message: %s", result.getConflictReason().toString()));
                  response.sendRedirect(NavigationRules.INTERNAL_ERROR);
                  return;
                case INVALID_CREDENTIALS:
                  logger.log(Level.SEVERE, "Erroneous authentication provider status: INVALID_CREDENTIALS in external login page");
                  response.sendRedirect(NavigationRules.INTERNAL_ERROR);
                  return;
                case NO_EMAIL:
                  response.sendRedirect(NavigationRules.AUTH_NOEMAIL);
                  return;
                case PROCESSING:
                  logger.log(Level.SEVERE, "Erroneous authentication provider status: PROCESSING without redirectUrl");
                  response.sendRedirect(NavigationRules.INTERNAL_ERROR);
                  return;
                case ERROR:
                  response.sendRedirect(NavigationRules.INTERNAL_ERROR);
                  return;
              }
              
              if (StringUtils.isBlank(postLoginRedirectUrl)) {
                postLoginRedirectUrl = request.getContextPath() + "/";
              }
              
              response.sendRedirect(postLoginRedirectUrl);
            }
          } else {
            logger.log(Level.SEVERE, "Invalid authenticationProvider");
            response.sendRedirect(NavigationRules.INTERNAL_ERROR);
          }
        } else {
          logger.log(Level.SEVERE, "Invalid authSourceId");
          response.sendRedirect(NavigationRules.INTERNAL_ERROR);
        }
      }
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Login failed because of an internal error", e);
      response.sendRedirect(NavigationRules.INTERNAL_ERROR);
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }

}
