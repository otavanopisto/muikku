package fi.muikku.atests;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.rest.AbstractRESTService;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;


@Path("/test")
@Produces("application/json")
public class AcceptanceTestsRESTService extends AbstractRESTService {

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login(@QueryParam ("role") String role) {
    System.out.println("Pälli " + role);
    
    switch (role) {
      case "ENVIRONMENT-STUDENT":
        localSessionController.login("PYRAMUS", "STUDENT-1");
      break;
      case "ENVIRONMENT-TEACHER":
        localSessionController.login("PYRAMUS", "TEACHER-2");
      break;
      case "ENVIRONMENT-MANAGER":
        localSessionController.login("PYRAMUS", "MANAGER-3");
      break;
      case "ENVIRONMENT-ADMINISTRATOR":
        localSessionController.login("PYRAMUS", "ADMINISTRATOR-4");
      break;
      
      case "PSEUDO-EVERYONE":
        // Do nothing
      break;
      
    }
    
    return Response.ok().build();
  }

}
