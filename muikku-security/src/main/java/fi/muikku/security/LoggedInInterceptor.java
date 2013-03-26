package fi.muikku.security;

import java.io.Serializable;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

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
  private Instance<Identity> identityInstance;

  @AroundInvoke
  public Object checkLogin(InvocationContext ctx) throws Exception {
    Identity identity = identityInstance.get();
    if (identity != null) {
      if (identity.isLoggedIn())
        return ctx.proceed();
      else
        throw new AuthorizationException("Not logged in");
    } else
      throw new RuntimeException("LoggedInInterceptor - Identity bean not found");
  }
}