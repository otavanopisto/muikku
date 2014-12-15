package fi.muikku.security;

import java.io.Serializable;
import java.net.URLEncoder;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

/**
 * Interceptor for @LoggedIn annotation. Checks that the user calling the annotated method has logged in. 
 * Uses Identity for checks on user login status.
 * 
 * @author antti.viljakainen
 */
@LoggedIn
@Interceptor
public class LoggedInInterceptor implements Serializable {

  private static final long serialVersionUID = -2098163583725766390L;

  @Inject
  private HttpServletRequest httpServletRequest;

  @Inject
  private Instance<Identity> identityInstance;

  @AroundInvoke
  public Object checkLogin(InvocationContext ctx) throws Exception {
    Identity identity = identityInstance.get();
    if (identity != null) {
      if (identity.isLoggedIn()) {
        return ctx.proceed();
      } else { 
        String redirectUrl = (String) httpServletRequest.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        if (redirectUrl == null) {
          redirectUrl = httpServletRequest.getRequestURL().toString();
        }
        
        return "/login.jsf?faces-redirect=true&redirectUrl=" + URLEncoder.encode(redirectUrl, "UTF-8");
      }
    } else
      throw new RuntimeException("LoggedInInterceptor - Identity bean not found");
  }
}