package fi.otavanopisto.muikku.rest;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

import javax.inject.Inject;
import javax.ws.rs.PathParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.lang3.math.NumberUtils;
import org.jboss.resteasy.annotations.interception.ServerInterceptor;
import org.jboss.resteasy.core.ResourceMethodInvoker;
import org.jboss.resteasy.core.ServerResponse;
import org.jboss.resteasy.spi.Failure;
import org.jboss.resteasy.spi.HttpRequest;
import org.jboss.resteasy.spi.interception.PreProcessInterceptor;

import fi.otavanopisto.muikku.session.SessionControllerDelegate;

//@Provider
@ServerInterceptor
public class ContextInterceptor implements PreProcessInterceptor {
  
  @Inject
  private SessionControllerDelegate sessionControllerDelegate;

  @Override
  public ServerResponse preProcess(HttpRequest request, ResourceMethodInvoker methodInvoker) throws Failure, WebApplicationException {
    Method method = methodInvoker.getMethod();
    
    Annotation[][] methodParameterAnnotations = method.getParameterAnnotations();
    Class<?>[] methodParameterTypes = method.getParameterTypes();
    
    MultivaluedMap<String,String> pathParameters = request.getUri().getPathParameters();
    
    for (int i = 0, l = methodParameterAnnotations.length; i < l; i++) {
      Annotation[] parameterAnnotations = methodParameterAnnotations[i];
      Annotation sessionContextAnnotation = null;
      Annotation pathParamAnnotation = null;
      
      for (Annotation parameterAnnotation : parameterAnnotations) {
        if (parameterAnnotation.annotationType().equals(SessionContext.class)) {
          sessionContextAnnotation = parameterAnnotation;
        } else {
          pathParamAnnotation = parameterAnnotation;
        }
      }
      
      if ((sessionContextAnnotation != null) && (pathParamAnnotation != null)) {
        Class<?> methodParameterType = methodParameterTypes[i];
        if (methodParameterType.equals(Long.class)) {
          String pathParam = ((PathParam) pathParamAnnotation).value();
          String pathParamValue = pathParameters.getFirst(pathParam);
          Long contextId = NumberUtils.createLong(pathParamValue);
          SessionContextType contextType = ((SessionContext) sessionContextAnnotation).type();
          fi.otavanopisto.muikku.rest.SessionContextImpl sessionContext = new fi.otavanopisto.muikku.rest.SessionContextImpl(contextId, contextType);
          
          switch (sessionContext.getType()) {
            case ENVIRONMENT:

            break;
            case COURSE:
              // TODO Courses in seesion context :)
              throw new RuntimeException("Course in session context");
          }
        }
      }
    }
    
    return null;
  }


}
