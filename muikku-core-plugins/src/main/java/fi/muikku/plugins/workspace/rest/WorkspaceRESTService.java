package fi.muikku.plugins.workspace.rest;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceUser;
import fi.tranquil.TranquilityBuilderFactory;

@RequestScoped
@Path("/workspace")
@Stateful
@Produces ("application/json")
public class WorkspaceRESTService extends PluginRESTService {
	
	@Inject
	private Logger logger;

	@SuppressWarnings("cdi-ambiguous-dependency")
	@Inject
	private TranquilityBuilderFactory tranquilityBuilderFactory;

	@Inject
	private WorkspaceController workspaceController;
	
	// 
	// WorkspaceEntity 
	// 
		
	@POST
	@Path ("/workspaceEntities/")
	public Response createWorkspaceEntity() {
		return null;
	}
	
	@GET
	@Path ("/workspaceEntities/")
	public Response listWorkspaceEntities() {
		List<WorkspaceEntity> workspaceEntities = workspaceController.listWorkspaceEntities();
		
		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entities(workspaceEntities)
		).build();
	}
	
	@GET
	@Path ("/workspaceEntities/{ID}")
	public Response getWorkspaceEntity(@PathParam ("ID") Long workspaceEntityId) {
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);

		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entity(workspaceEntity)
		).build();
	}
	
	// 
	// Workspace
	// 
	
	@POST
	@Path ("/workspaces/")
	public Response createWorkspace() {
		return null;
	}
	
	@GET
	@Path ("/workspaces/")
	public Response listWorkspaces() {
		List<Workspace> workspaces = workspaceController.listWorkspaces();

		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entities(workspaces)
		).build();
	}
	
	@GET
	@Path ("/workspaces/{WORKSPACE_ENTITY_ID}")
	public Response getWorkspace(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId) {
		WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
		if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
		
		Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
		return Response.ok(
		  tranquilityBuilderFactory.createBuilder()
		    .createTranquility()
		    .entity(workspace)
		).build();
	}
	
	//
	// Members
	//
  
  @GET
  @Path ("/workspaces/{WORKSPACE_ENTITY_ID}/users")
  public Response getWorkspaceUsers(@PathParam ("WORKSPACE_ENTITY_ID") Long workspaceEntityId) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    List<WorkspaceUser> workspaceUsers = workspaceController.listWorkspaceUsers(workspace);
    
    return Response.ok(
      tranquilityBuilderFactory.createBuilder()
        .createTranquility()
        .entities(workspaceUsers)
    ).build();
  }
	
}
