package fi.otavanopisto.muikku.atests;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/test_permissions")
@Stateful
@Produces("application/json")
@Consumes("application/json")
public class PermissionsAcceptanceTestsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8129061062696701210L;

  @GET
  @Path("/restpermit/loggedin")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response restPermitLoggedin() {
    return Response.noContent().build();
  }

  @GET
  @Path("/restpermit/ADMIN")
  @RESTPermit (AtestsPermissionCollection.ATESTS_ADMINISTRATOR)
  public Response restPermitAdministrator() {
    return Response.noContent().build();
  }

  @GET
  @Path("/restpermit/MANAGER")
  @RESTPermit (AtestsPermissionCollection.ATESTS_MANAGER)
  public Response restPermitManager() {
    return Response.noContent().build();
  }

  @GET
  @Path("/restpermit/TEACHER")
  @RESTPermit (AtestsPermissionCollection.ATESTS_TEACHER)
  public Response restPermitTeacher() {
    return Response.noContent().build();
  }

  @GET
  @Path("/restpermit/STUDENT")
  @RESTPermit (AtestsPermissionCollection.ATESTS_STUDENT)
  public Response restPermitStudent() {
    return Response.noContent().build();
  }

  @GET
  @Path("/restpermit/EVERYONE")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response restPermitEveryone() {
    return Response.noContent().build();
  }

}
