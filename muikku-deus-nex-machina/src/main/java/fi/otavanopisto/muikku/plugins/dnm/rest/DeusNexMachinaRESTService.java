package fi.otavanopisto.muikku.plugins.dnm.rest;

import java.util.List;
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

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.dnm.unembed.MaterialUnEmbedder;
import fi.otavanopisto.muikku.plugins.dnm.util.HtmlMaterialCleaner;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNodeType;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
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
  private HtmlMaterialCleaner htmlMaterialCleaner;
  
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
  
  @GET
  @Path("/cleanworkspacematerials/{ID}")
  @RESTPermit (DeusNexMachinaPermissions.CLEAN_WORKSPACE_MATERIALS)
  public Response cleanWorkspaceMaterials(@PathParam("ID") Long workspaceEntityId, @Context Request request) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity != null) {
      WorkspaceNode rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
      try {
        List<WorkspaceNode> nodes = workspaceMaterialController.listWorkspaceNodesByParent(rootFolder);
        cleanMaterials(nodes);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, "Cleaning materials of workspace " + workspaceEntityId + " failed", e);
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    }
    else {
      return Response.status(Status.NOT_FOUND).entity("Unknown workspace " + workspaceEntityId).build();
    }
    return Response.status(Status.OK).entity("Workspace " + workspaceEntityId + " materials successfully cleaned").build();
  }
  
  private void cleanMaterials(List<WorkspaceNode> nodes) {
    for (WorkspaceNode node : nodes) {
      if (node.getType() != WorkspaceNodeType.MATERIAL) {
        cleanMaterials(workspaceMaterialController.listWorkspaceNodesByParent(node));
      }
      else {
        WorkspaceMaterial workspaceMaterial = (WorkspaceMaterial) node;
        Material material = workspaceMaterialController.getMaterialForWorkspaceMaterial(workspaceMaterial);
        if ("html".equals(material.getType())) {
          logger.info("Cleaning html material " + material.getId());
          htmlMaterialCleaner.cleanMaterial((HtmlMaterial) material,  workspaceMaterial);
        }
      }
    }
  }

}
