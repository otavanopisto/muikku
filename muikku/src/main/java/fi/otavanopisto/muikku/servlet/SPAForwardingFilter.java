package fi.otavanopisto.muikku.servlet;

import java.io.IOException;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

/**
 * Filter that forwards certain paths always to a common (x)html 
 * page that is expected to handle the paths routing. The html
 * is likely a Single-Page Application that handles the routing
 * based on the browser's URL.
 */
@WebFilter(urlPatterns = "/*")
public class SPAForwardingFilter implements Filter {
  
  // Entrypoint (likely html file) that initializes the SPA
  private static final String SPA_ENTRYPOINT = "/index.xhtml";
  
  // The paths that are redirected to the SPA Entrypoint
  private static final Set<String> FRONTEND_PATHS = Set.of(
      "/announcer",
      "/communicator",
      "/coursepicker",
      "/evaluation",
      "/guider",
      "/organization",
      "/profile"
  );

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (request instanceof HttpServletRequest) {
      HttpServletRequest httpRequest = (HttpServletRequest) request;
      if (FRONTEND_PATHS.contains(httpRequest.getServletPath())) {
        request.getRequestDispatcher(SPA_ENTRYPOINT).forward(httpRequest, response);
        return;
      }
    }
    
    chain.doFilter(request, response);
  }

}
