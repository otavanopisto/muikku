package fi.otavanopisto.muikku.schooldata;

import java.io.Serializable;

import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Interceptor
@RestCatchSchoolDataExceptions
public class RestCatchSchoolDataExceptionsInterceptor implements Serializable {
  
  private static final long serialVersionUID = 1L;

  @AroundInvoke
  public Object aroundInvoke(
      InvocationContext invocationContext
  ) throws Exception {
    try {
      return invocationContext.proceed();
    } catch (SchoolDataBridgeUnauthorizedException ex) {
      return Response.status(Status.FORBIDDEN).entity(ex.getMessage()).build();
    } catch (SchoolDataBridgeException ex) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
    } 
  }
}
