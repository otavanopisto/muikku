package fi.muikku.security;

import java.io.Serializable;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

/**
 * Interceptor for @Admin annotation. Uses Identity to check that user has Administrator status.
 * 
 * @author antti.viljakainen
 */
@Admin
@Interceptor
public class AdminInterceptor implements Serializable {

  private static final long serialVersionUID = -1550224146108083692L;

  @Inject
  private Instance<Identity> identityInstance;
  
  @AroundInvoke
  public Object authorize(InvocationContext ctx) throws Exception {
    Identity identity = identityInstance.get();

    if (identity != null) {
      if ((identity.isLoggedIn()) && (identity.isAdmin()))
        return ctx.proceed();
      else
        throw new AuthorizationException("Not a superuser");
    } else
      throw new RuntimeException("AdminInterceptor - Identity bean not found");
  }
}