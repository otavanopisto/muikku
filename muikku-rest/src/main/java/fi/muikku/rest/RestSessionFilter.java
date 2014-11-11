package fi.muikku.rest;

import java.io.IOException;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import fi.muikku.session.RestSessionController;
import fi.muikku.session.RestSesssion;
import fi.muikku.session.SessionControllerDelegate;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionAuthentication;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.session.local.LocalSessionRestAuthentication;

@WebFilter(urlPatterns = "/rest/*")
public class RestSessionFilter implements Filter {

  @Inject
  @RestSesssion
  private RestSessionController restSessionController;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  @Default
  private SessionControllerDelegate sessionControllerDelegate;
  
  @Inject
  @LocalSessionAuthentication
  private LocalSessionRestAuthentication localSessionRestAuthentication;
  
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    localSessionRestAuthentication.setActiveUser(localSessionController.getActiveUserSchoolDataSource(), localSessionController.getActiveUserIdentifier());
    restSessionController.setAuthentication(localSessionRestAuthentication);
    restSessionController.setLocale(request.getLocale());
    sessionControllerDelegate.setImplementation(restSessionController);

    try {
      chain.doFilter(request, response);
    } finally {
      restSessionController.logout();
    }
  }

  @Override
  public void destroy() {
  }

}
