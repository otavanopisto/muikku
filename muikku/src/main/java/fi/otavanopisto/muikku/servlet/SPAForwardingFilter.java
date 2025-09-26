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
  private static final String SPA_ENTRYPOINT = "/index.html";
  
  // The paths that are redirected to the SPA Entrypoint
  private static final Set<String> FRONTEND_PATHS = Set.of(
      "/announcements",
      "/announcer",
      "/communicator",
      "/coursepicker",
      "/evaluation",
      "/discussion",
      "/guider",
      "/guardian_hops",
      "/guardian",
      "/hops",
      "/organization",
      "/profile",
      "/records",
      "/languageprofile"
  );

  // Partial paths to forward to the SPA Entrypoint
  private static final String[] FRONTEND_PARTIAL_PATHS = {
      "/forgotpassword/",
      "/ceepos/",
      "/error/"
  };
  
  // Workspace path with special handling for specific subpaths
  private static final String WORKSPACE_ROOT = "/workspace/";
  
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (request instanceof HttpServletRequest) {
      HttpServletRequest httpRequest = (HttpServletRequest) request;
      String path = httpRequest.getServletPath();
      
      boolean found = 
          FRONTEND_PATHS.contains(path) 
          || StringUtils.startsWithAny(path, FRONTEND_PARTIAL_PATHS) 
          || isSPAWorkspacePath(path);
      
      if (found) {
        request.getRequestDispatcher(SPA_ENTRYPOINT).forward(httpRequest, response);
        return;
      }
    }
    
    chain.doFilter(request, response);
  }

  /**
   * Returns true if the path is a workspace path that should be
   * handled by the SPA application routing.
   * 
   * Specifically, returns false for paths that point to a media
   * resource within materials as those should be handled by the
   * backend. 
   * 
   * These paths are of the form 
   * /workspace/{workspaceName}/materials/{materialname}/{attachmentName}.
   * 
   * @param path
   * @return
   */
  private boolean isSPAWorkspacePath(String path) {
    if (StringUtils.startsWith(path, WORKSPACE_ROOT)) {
      String[] pathSegments = path.split("/");
      return !(
          pathSegments.length >= 5 
          && StringUtils.equals(pathSegments[1], "workspace")
          && StringUtils.equals(pathSegments[3], "materials")
      );
    }
    
    return false;
  }

}
