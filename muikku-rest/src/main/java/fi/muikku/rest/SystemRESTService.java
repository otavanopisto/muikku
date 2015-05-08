package fi.muikku.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/system")
@Produces("application/json")
public class SystemRESTService extends AbstractRESTService {

  @GET
  @Path("/ping")
  @Produces("text/plain")
  public Response ping() {
    return Response.ok("pong").build();
  }

}
