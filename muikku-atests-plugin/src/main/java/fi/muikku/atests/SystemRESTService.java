package fi.muikku.atests;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.muikku.rest.AbstractRESTService;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;


@Path("/test")
@Produces("application/json")
public class SystemRESTService extends AbstractRESTService {

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @GET
  @Path("/login")
  @Produces("text/plain")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response test_login() {
    localSessionController.login("PYRAMUS", "STUDENT-1");
    
    return Response.ok().build();
  }

}
