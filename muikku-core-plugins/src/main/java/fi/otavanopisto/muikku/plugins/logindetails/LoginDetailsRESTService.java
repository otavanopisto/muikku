package fi.otavanopisto.muikku.plugins.logindetails;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.rest.AbstractRESTService;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Stateful
@RequestScoped
@Path("/user")
@Produces("application/json")
@Consumes("application/json")
public class LoginDetailsRESTService extends AbstractRESTService {

	@Inject
	private SessionController sessionController;
  
  @Inject
  private LoginDetailController loginDetailController; 
  
  @GET
  @Path("/students/{STUDENTIDENTIFIER}/logins")
  @RESTPermit (handling = Handling.INLINE)
  public Response listLogins(@PathParam ("STUDENTIDENTIFIER") String studentId, @QueryParam ("maxResults") @DefaultValue ("5") Integer maxResults) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentId);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (!studentIdentifier.equals(sessionController.getLoggedUser())) {
      if (!sessionController.hasEnvironmentPermission(LoginDetailsPermissions.LIST_USER_LOGIN_DETAILS)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    List<LoginDetailsRestModel> result = new ArrayList<>();
    
    List<LoginDetails> lastLogins = loginDetailController.getLastLogins(studentIdentifier, maxResults);
    for (LoginDetails loginDetails : lastLogins) {
      result.add(new LoginDetailsRestModel(loginDetails.getUserIdentifier().toId(), loginDetails.getAuthenticationProvder(), loginDetails.getAddress(), loginDetails.getTime()));
    }
    
    return Response.ok(result).build();
  }

}
