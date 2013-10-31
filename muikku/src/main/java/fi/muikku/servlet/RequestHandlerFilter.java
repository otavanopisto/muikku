package fi.muikku.servlet;

import java.io.IOException;
import java.util.Iterator;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fi.muikku.RequestHandler;

@WebFilter (urlPatterns = "/*")
public class RequestHandlerFilter implements Filter {
	
	@Any
	@Inject
	private Instance<RequestHandler> requestHandlers;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		if (req instanceof HttpServletRequest && resp instanceof HttpServletResponse) {
  		HttpServletRequest request = (HttpServletRequest) req;
  		HttpServletResponse response = (HttpServletResponse) resp;
  		
  		Iterator<RequestHandler> requestHandlers = this.requestHandlers.iterator();
  		while (requestHandlers.hasNext()) {
  			RequestHandler requestHandler = requestHandlers.next();
  			if (requestHandler.handleRequest(request, response)) {
  				return;
  			}
  		}
		}
		
		chain.doFilter(req, resp);
	}

	@Override
	public void destroy() {
	}

}
