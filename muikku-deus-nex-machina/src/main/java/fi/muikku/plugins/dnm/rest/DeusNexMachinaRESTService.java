package fi.muikku.plugins.dnm.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.dnm.unembed.MaterialUnEmbedder;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.security.rest.RESTPermit;

@RequestScoped
@Path("/dnm")
@Stateful
@Produces("application/json")
public class DeusNexMachinaRESTService extends PluginRESTService {

  private static final long serialVersionUID = -3462127616854447813L;
  
  @Inject
  private MaterialUnEmbedder materialUnembedder;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private Logger logger;

  @GET
  @Path("/manualunembed/{ID}")
  @RESTPermit (DeusNexMachinaPermissions.UNEMBED_WORKSPACE_MATERIALS)
  public Response manualUnembed(@PathParam("ID") Long workspaceEntityId, @Context Request request) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity != null) {
      WorkspaceNode rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
  
      try {
        materialUnembedder.unembedWorkspaceMaterials(rootFolder);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Manual unembed of workspace " + workspaceEntityId + " materials failed", e);
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    }
    else {
      return Response.status(Status.NOT_FOUND).entity("Unknown workspace " + workspaceEntityId).build();
    }
    return Response.status(Status.OK).entity("Workspace " + workspaceEntityId + " materials successfully unembedded").build();
  }

}
