package fi.muikku.rest;

import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.jboss.resteasy.auth.oauth.OAuthProvider;

public class OAuthInjectListener implements ServletContextListener {

  @Inject
  private OAuthProvider oAuthProvider;
  
  @Override
  public void contextInitialized(ServletContextEvent sce) {
    ServletContext context = sce.getServletContext();
    context.setAttribute(OAuthProvider.class.getName(), oAuthProvider);
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
  }

}
