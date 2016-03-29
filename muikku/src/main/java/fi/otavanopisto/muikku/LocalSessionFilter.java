package fi.otavanopisto.muikku;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;

import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.SessionControllerDelegate;
import fi.otavanopisto.muikku.session.local.LocalSession;

@WebFilter(
  dispatcherTypes = {
    DispatcherType.REQUEST,
  	DispatcherType.FORWARD
  },  
  urlPatterns = "*"
)
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
