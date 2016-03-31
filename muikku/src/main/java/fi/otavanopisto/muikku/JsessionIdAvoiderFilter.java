package fi.otavanopisto.muikku;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class JsessionIdAvoiderFilter implements Filter {

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    boolean allowFilterChain = redirectToAvoidJsessionId((HttpServletRequest) req, (HttpServletResponse) res);
    if (allowFilterChain)
      chain.doFilter(req, res);
  }

  public static boolean redirectToAvoidJsessionId(HttpServletRequest req, HttpServletResponse res) {
    HttpSession s = req.getSession();
    if (s.isNew()) {

      if (!(req.isRequestedSessionIdFromCookie() && req.isRequestedSessionIdFromURL())) {
        String qs = req.getQueryString();

        String requestURI = req.getRequestURI();
        try {
          res.sendRedirect(requestURI + "?" + qs);
          return false;
        } catch (IOException e) {
          Logger.getLogger(JsessionIdAvoiderFilter.class.getName()).log(Level.INFO, "Error sending redirect. " + e.getMessage());
        }
      }
    }
    return true;
  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void destroy() {
  }
}