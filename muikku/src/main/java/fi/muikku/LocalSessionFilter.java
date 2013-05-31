package fi.muikku;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

import fi.muikku.session.SessionController;
import fi.muikku.session.SessionControllerDelegate;
import fi.muikku.session.local.LocalSession;

@WebFilter(servletNames = {
  "FacesServlet",
  "jsp",
  "OAuth",
  "JavaScriptLocaleServlet",
  "UserPictureUploadServlet"
})
public class LocalSessionFilter implements Filter {

  @Inject
  @LocalSession
  private SessionController sessionController;

  @Inject
  private SessionController sessionControllerDelegate;
  
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    ((SessionControllerDelegate) sessionControllerDelegate).setImplementation(sessionController);
    chain.doFilter(request, response);
  }

  @Override
  public void destroy() {
  }

}
