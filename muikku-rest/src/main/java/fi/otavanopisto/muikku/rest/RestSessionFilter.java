package fi.otavanopisto.muikku.rest;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Default;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import org.jboss.resteasy.core.ResourceMethodInvoker;

import fi.otavanopisto.muikku.session.RestSessionController;
import fi.otavanopisto.muikku.session.RestSesssion;
import fi.otavanopisto.muikku.session.SessionControllerDelegate;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionAuthentication;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.session.local.LocalSessionRestAuthentication;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.Identity;
import fi.otavanopisto.security.Permit.Style;
import fi.otavanopisto.security.PermitUtils;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Provider
public class RestSessionFilter implements javax.ws.rs.container.ContainerRequestFilter {

  @Inject
  private Logger logger;
  
  @Context
  private HttpServletRequest request;

  @Context
  private HttpServletResponse response;

  @Inject
  private Instance<Identity> identityInstance;

  @Inject
  @RestSesssion
  private RestSessionController restSessionController;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  @Default
  private SessionControllerDelegate sessionControllerDelegate;
  
  @Inject
  @LocalSessionAuthentication
  private LocalSessionRestAuthentication localSessionRestAuthentication;
  
  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
    localSessionRestAuthentication.setActiveUser(localSessionController.getLoggedUserSchoolDataSource(), localSessionController.getLoggedUserIdentifier());
    restSessionController.setAuthentication(localSessionRestAuthentication);
    restSessionController.setLocale(request.getLocale());
    sessionControllerDelegate.setImplementation(restSessionController);
    
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
      /**
       * Identity bean must be satisfied and unambiguous.
       */
      
      if (identityInstance.isUnsatisfied())
        throw new RuntimeException("PermitInterceptor - Identity bean unavailable");
      if (identityInstance.isAmbiguous())
        throw new RuntimeException("PermitInterceptor - Identity bean is ambiguous");
      
      Identity identity = identityInstance.get();
      
      // If login is required, check that first as it's unrelated to the permission check
      if (permit.requireLoggedIn()) {
        if (!identity.isLoggedIn())
          return false;
      }
      
      // Inline checks are handled in the rest endpoint code so they are skipped here. 
      if ((permit.handling() == Handling.INLINE) || (permit.handling() == Handling.UNSECURED))
        return true;

      String[] permissions = permit.value();
      Style style = permit.style();
      ContextReference permitContext = null;
      
      return PermitUtils.hasPermission(identity, permissions, permitContext, style);
    } else {
      /** Temporary workaround until all rest permissions are fully implemented **/
      RESTPermitUnimplemented unimplemented = method.getAnnotation(RESTPermitUnimplemented.class);
      if (unimplemented != null)
        return true; // Return true for unimplemented rest endpoints
      /** Temporary workaround until all rest permissions are fully implemented **/

      // Return false in a normal situation where RESTPermit is not defined
      String methodName = method != null ? method.getName() : "unknown";
      logger.log(Level.WARNING, String.format("Execution of REST endpoint which doesn't have RESTPermit annotation (%s) was blocked.", methodName));
      return false;
    }
  }
}
