package fi.muikku.rest.security;

import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.security.AuthorizationException;

@AuthorizedResource
@Interceptor
public class AuthorizedResourceInterceptor {

  public AuthorizedResourceInterceptor() {
  }

  @AroundInvoke
  public Object aroundInvoke(InvocationContext ic) throws Exception {
    Object result = null;
    try {
      System.out.println("@AuthorizedResource " + ic.getMethod().getName());
      result = ic.proceed();
    } catch (AuthorizationException ex) {
      result = Response.status(Status.FORBIDDEN).build();
    }
    
    return result;
  }
}
