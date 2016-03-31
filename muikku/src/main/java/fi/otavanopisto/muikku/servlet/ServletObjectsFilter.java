package fi.otavanopisto.muikku.servlet;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import fi.otavanopisto.muikku.servlet.ServletObjectsContainer;

@WebFilter (urlPatterns = "/*")
public class ServletObjectsFilter implements Filter {
  
  @Inject
  private ServletObjectsContainer servletObjectsContainer;
	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
	  if (req instanceof HttpServletRequest) {
	    HttpServletRequest request = (HttpServletRequest) req;
	    servletObjectsContainer.setContextPath(request.getContextPath());
	    String currentUrl = request.getRequestURL().toString();
	    String pathInfo = request.getRequestURI();
	    servletObjectsContainer.setBaseUrl(currentUrl.substring(0, currentUrl.length() - pathInfo.length()) + request.getContextPath());
	  }
	  chain.doFilter(req, resp);
	}

	@Override
	public void destroy() {
	}

}
