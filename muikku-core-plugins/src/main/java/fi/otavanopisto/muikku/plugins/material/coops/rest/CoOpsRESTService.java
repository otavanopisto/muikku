package fi.otavanopisto.muikku.plugins.material.coops.rest;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.foyt.coops.CoOpsApi;
import fi.foyt.coops.CoOpsConflictException;
import fi.foyt.coops.CoOpsForbiddenException;
import fi.foyt.coops.CoOpsInternalErrorException;
import fi.foyt.coops.CoOpsNotFoundException;
import fi.foyt.coops.CoOpsNotImplementedException;
import fi.foyt.coops.CoOpsUsageException;
import fi.foyt.coops.model.File;
import fi.foyt.coops.model.Patch;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;

@Path ("/coops/{FILEID}")
@RequestScoped
@Produces (MediaType.APPLICATION_JSON)
@Stateful
public class CoOpsRESTService {

  @Inject
  private CoOpsApi coOpsApi;
  
  @Inject
  private SessionController muikkuSessionController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  private boolean isAuthorized() {
      if (!muikkuSessionController.isLoggedIn()) {
        return false;
      }
      
      UserEntity userEntity = muikkuSessionController.getLoggedUserEntity();
      
      EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
      
      if (environmentUser.getRole() == null || environmentUser.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
        return false;
      }
      
      return true;
  }

  @GET
  @Path ("/")
  @RESTPermitUnimplemented
  public Response load(@PathParam ("FILEID") String fileId, @QueryParam ("revisionNumber") Long revisionNumber) {
    try {
      File file = coOpsApi.fileGet(fileId, revisionNumber);
      return Response.ok(file).build();
    } catch (CoOpsNotImplementedException e) {
      return Response.status(Status.NOT_IMPLEMENTED).build();
    } catch (CoOpsNotFoundException e) {
      return Response.status(Status.NOT_FOUND).build();
    } catch (CoOpsUsageException e) {
      return Response.status(Status.BAD_REQUEST).build();
    } catch (CoOpsInternalErrorException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } catch (CoOpsForbiddenException e) {      
      return Response.status(Status.FORBIDDEN).build();
    } 
  }
  
  @PATCH
  @Path ("/")
  @RESTPermitUnimplemented
  public Response patch(@PathParam ("FILEID") String fileId, Patch patch) {
    
    if (!isAuthorized()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    try {
      coOpsApi.filePatch(fileId, patch.getSessionId(), patch.getRevisionNumber(), patch.getPatch(), patch.getProperties(), patch.getExtensions());
      return Response.noContent().build();
    } catch (CoOpsNotFoundException e) {
      return Response.status(Status.NOT_FOUND).build();
    } catch (CoOpsUsageException e) {
      return Response.status(Status.BAD_REQUEST).build();
    } catch (CoOpsInternalErrorException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } catch (CoOpsForbiddenException e) {      
      return Response.status(Status.FORBIDDEN).build();
    } catch (CoOpsConflictException e) {
      return Response.status(Status.CONFLICT).build();
    } 
  }
  
  @GET
  @Path ("/update")
  @RESTPermitUnimplemented
  public Response update(@PathParam ("FILEID") String fileId, @QueryParam ("sessionId") String sessionId, @QueryParam ("revisionNumber") Long revisionNumber) {
    try {
      List<Patch> patches = coOpsApi.fileUpdate(fileId, sessionId, revisionNumber);
      if (patches.isEmpty()) {
        return Response.noContent().build();
      } else {
        return Response.ok(patches).build();
      }
    } catch (CoOpsNotFoundException e) {
      return Response.status(Status.NOT_FOUND).build();
    } catch (CoOpsUsageException e) {
      return Response.status(Status.BAD_REQUEST).build();
    } catch (CoOpsInternalErrorException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } catch (CoOpsForbiddenException e) {      
      return Response.status(Status.FORBIDDEN).build();
    } 
  }
  
  @GET
  @Path ("/join")
  @RESTPermitUnimplemented
  public Response join(@PathParam ("FILEID") String fileId, @QueryParam("algorithm") List<String> algorithms, @QueryParam ("protocolVersion") String protocolVersion) {
    try {
      return Response.ok(coOpsApi.fileJoin(fileId, algorithms, protocolVersion)).build();
    } catch (CoOpsNotFoundException e) {
      return Response.status(Status.NOT_FOUND).build();
    } catch (CoOpsUsageException e) {
      return Response.status(Status.BAD_REQUEST).build();
    } catch (CoOpsInternalErrorException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } catch (CoOpsForbiddenException e) {      
      return Response.status(Status.FORBIDDEN).build();
    } catch (CoOpsNotImplementedException e) {
      return Response.status(Status.NOT_IMPLEMENTED).build();
    } 
  }
  
}
