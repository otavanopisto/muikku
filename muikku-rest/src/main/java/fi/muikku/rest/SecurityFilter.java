package fi.muikku.rest;

import java.io.IOException;
import java.lang.reflect.Method;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.core.ResourceMethodInvoker;

import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.Identity;
import fi.otavanopisto.security.Permit.Style;
import fi.otavanopisto.security.PermitUtils;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Provider
public class SecurityFilter implements javax.ws.rs.container.ContainerRequestFilter {

  @Context
  private HttpServletRequest request;

  @Context
  private HttpServletResponse response;

  @Inject
  private Instance<Identity> identityInstance;

//  @Inject
//  private OauthController oauthController;
//  
//  @Inject
//  private SessionControllerDelegate sessionControllerDelegate;
  
//  @Inject
//  @RestSession
//  private SessionController sessionController;

//  @Inject
//  private RESTSecurity restSecurity;
  
  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
//    sessionControllerDelegate.setImplementation(sessionController);
    
    ResourceMethodInvoker methodInvoker = (ResourceMethodInvoker) requestContext.getProperty("org.jboss.resteasy.core.ResourceMethodInvoker");
    Method method = methodInvoker.getMethod();
    if (method == null){
      requestContext.abortWith(Response.status(javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR).build());
    } else {
      if (!checkPermission(method)) {
        requestContext.abortWith(Response.status(javax.ws.rs.core.Response.Status.FORBIDDEN).build());
      }
    }
  }
  
  private boolean checkPermission(Method method) {
    RESTPermit permit = method.getAnnotation(RESTPermit.class);

    if (permit != null) {
      // Inline checks are handled in the rest endpoint code so they are skipped here. 
      if ((permit.handling() == Handling.INLINE) || (permit.handling() == Handling.UNSECURED))
        return true;

      if (identityInstance.isUnsatisfied())
        throw new RuntimeException("PermitInterceptor - Identity bean unavailable");
      if (identityInstance.isAmbiguous())
        throw new RuntimeException("PermitInterceptor - Identity bean is ambiguous");
      
      Identity identity = identityInstance.get();
      
      String[] permissions = permit.value();
      Style style = permit.style();
      ContextReference permitContext = null;
      
      return PermitUtils.hasPermission(identity, permissions, permitContext, style);
    } else
      return false;
  }
}
