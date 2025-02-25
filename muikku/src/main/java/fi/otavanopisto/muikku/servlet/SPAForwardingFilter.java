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

import org.apache.commons.lang3.StringUtils;

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

  // Partial paths to forward to the SPA Entrypoint
  private static final String[] FRONTEND_PARTIAL_PATHS = {
      "/forgotpassword/",
      "/workspace/"
  };
  
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (request instanceof HttpServletRequest) {
      HttpServletRequest httpRequest = (HttpServletRequest) request;
      String path = httpRequest.getServletPath();
      
      boolean found = FRONTEND_PATHS.contains(path) || StringUtils.startsWithAny(path, FRONTEND_PARTIAL_PATHS);
      
      // TODO Remove debug message
      System.out.println("Polku: " + path + " Löytyi: " + found);
  
      if (found) {
        request.getRequestDispatcher(SPA_ENTRYPOINT).forward(httpRequest, response);
        return;
      }
    }
    
    chain.doFilter(request, response);
  }

}
