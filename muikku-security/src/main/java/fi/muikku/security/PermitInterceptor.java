package fi.muikku.security;

import java.io.Serializable;
import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

import fi.muikku.security.Permit.Style;

/**
 * Allows method access based on declared permissions in @Permit annotation. Uses Identity as base for permission checks.
 * 
 * @author antti.viljakainen
 */
@Permit
@Interceptor
public class PermitInterceptor implements Serializable {

  @Inject
  private Instance<Identity> identityInstance;
  
  private static final long serialVersionUID = 7092505565060991758L;
  
  @AroundInvoke
  public Object authorize(InvocationContext ctx) throws Exception {
    System.out.println("@Permit " + ctx.getMethod().getName());
    
    Permit permit = ctx.getMethod().getAnnotation(Permit.class);

    String[] permissions = permit.value();
    Style style = permit.style();

    boolean permitted = false;

    if (identityInstance.isUnsatisfied())
      throw new RuntimeException("PermitInterceptor - Identity bean unavailable");
    if (identityInstance.isAmbiguous())
      throw new RuntimeException("PermitInterceptor - Identity bean is ambiguous");
    
    Identity identity = identityInstance.get();
    
    switch (style) {
      case OR:
        // For or we break when permit is true
        for (String permission : permissions) {
          ContextReference permitContext = getPermitContext(ctx);
          
          if (permitted = identity.hasPermission(permission, permitContext))
            break;
        }
      break;
      
      case AND:
        // And is true by default (as long as at least one permission exists) and breaks if permit hits false
        permitted = permissions.length > 0;
        
        for (String permission : permissions) {
          ContextReference permitContext = getPermitContext(ctx);
          
          if (permitted = identity.hasPermission(permission, permitContext))
            break;
        }
      break;
    }
   
    if (permitted)
      return ctx.proceed();
    else {
      System.out.println("ACCESS DENIED TO: " + ctx.getMethod().getDeclaringClass().getSimpleName() + "." + ctx.getMethod().getName());

      switch (permit.handle()) {
        case SILENT:
          return null;
        case EXCEPTION:
          Class<? extends Exception> exceptionClass = permit.exceptionClass();
          throw exceptionClass.newInstance();
      }
    }
    return null;
  }
  
  private ContextReference getPermitContext(InvocationContext ctx) {
    List<Object> resourceEntitys = getParametersByAnnotation(ctx, PermitContext.class);
    
    if (resourceEntitys.isEmpty())
      return null;
    
    if (resourceEntitys.size() == 1)
      return (ContextReference) resourceEntitys.get(0);
    else
      throw new RuntimeException("PermitInterceptor.getPermitContext - exactly one @PermitContext expected for " + ctx.getMethod().getDeclaringClass().getName() + "." + ctx.getMethod().getName());
  }

  private List<Object> getParametersByAnnotation(InvocationContext ctx, @SuppressWarnings("rawtypes") Class annotationClass) {
    List<Object> result = new ArrayList<Object>();
    Annotation[][] parameterAnnotations = ctx.getMethod().getParameterAnnotations();
    
    for (int i = 0; i < parameterAnnotations.length; i++) {
      Annotation[] annotations = parameterAnnotations[i];
      for (Annotation annotation : annotations) {
        if (annotationClass.isInstance(annotation)) {
          result.add(ctx.getParameters()[i]);
        }
      }
    }
    return result;
  }
  
}