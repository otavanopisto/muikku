package fi.otavanopisto.muikku.atests;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/test_permissions")
@Stateful
@Produces("application/json")
@Consumes("application/json")
public class PermissionsAcceptanceTestsRESTService extends PluginRESTService {

  private static final long serialVersionUID = 8129061062696701210L;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
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
  
  @GET
  @Path("/environmentpermissions/{PERMISSIONNAME}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response testEnvironmentRestPermit(@PathParam("PERMISSIONNAME") String permissionName) {
    if (sessionController.hasEnvironmentPermission(permissionName)) {
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }

  @GET
  @Path("/workspaces/{WORKSPACEID}/permissions/{PERMISSIONNAME}")
  @RESTPermit (handling = Handling.UNSECURED)
  public Response testWorkspaceRestPermit(@PathParam("WORKSPACEID") Long workspaceId, @PathParam("PERMISSIONNAME") String permissionName) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);

    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Given workspace was not found.").build();
    }

    if (sessionController.hasWorkspacePermission(permissionName, workspaceEntity)) {
      return Response.noContent().build();
    } else {
      return Response.status(Status.FORBIDDEN).build();
    }
  }
}
