package fi.otavanopisto.muikku.security;

import java.io.Serializable;
import java.net.URLEncoder;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.security.Identity;

@LoggedInWithQueryParams
@Interceptor
public class LoggedInWithQueryParamsInterceptor implements Serializable {

  private static final long serialVersionUID = -6470687459437711638L;
  
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
      }
      else { 
        String redirectUrl = (String) httpServletRequest.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        if (redirectUrl == null) {
          redirectUrl = httpServletRequest.getRequestURL().toString();
          if (!StringUtils.isEmpty(httpServletRequest.getQueryString())) {
            redirectUrl += "?" + httpServletRequest.getQueryString();
          }
        }
        return "/login.jsf?faces-redirect=true&redirectUrl=" + URLEncoder.encode(redirectUrl, "UTF-8");
      }
    }
    else {
      throw new RuntimeException("LoggedInWithQueryParamsInterceptor - Identity bean not found");
    }
  }
}