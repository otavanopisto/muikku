package fi.muikku;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class RequestTimeoutLoggerFilter implements Filter {

  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    final HttpServletRequest hreq = (HttpServletRequest)req;
    Logger.getLogger("fi.muikku.RequestTimeoutLoggerFilter")
          .warning(String.format("%s to %s started", hreq.getMethod(), hreq.getRequestURI()));
    
    ScheduledExecutorService worker = Executors.newSingleThreadScheduledExecutor();
    worker.schedule(new Runnable() {
      @Override
      public void run() {
        
        Logger.getLogger("fi.muikku.RequestTimeoutLoggerFilter")
              .warning(String.format("%s to %s takes too long", hreq.getMethod(), hreq.getRequestURI()));
      }
    }, 5, TimeUnit.SECONDS);

    chain.doFilter(req, res);
    worker.shutdownNow();
    Logger.getLogger("fi.muikku.RequestTimeoutLoggerFilter")
          .warning(String.format("%s to %s finished", hreq.getMethod(), hreq.getRequestURI()));
  }

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void destroy() {
  }
}