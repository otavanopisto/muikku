package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNode;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Path("/materials")
@Stateful
@Produces("application/json")
public class MaterialRESTService extends PluginRESTService {

  private static final long serialVersionUID = 4177181930625188454L;

  @Inject
  private MaterialController materialController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private SessionController sessionController;
  
  @GET
//  @Path("/material/{ID:[0-9]*}/workspaceMaterials/")
  @Path("/material/{ID}/workspaceMaterials/")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listMaterialWorkspaceMaterials(@PathParam ("ID") Long materialId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.LIST_MATERIAL_WORKSPACE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    Material material = materialController.findMaterialById(materialId);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByMaterial(material); 

    return Response.ok(createRestModel(workspaceMaterials.toArray(new WorkspaceMaterial[0]))).build();
  }

  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial[] createRestModel(WorkspaceMaterial... workspaceMaterials) {
    List<fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial> result = new ArrayList<>();
    
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      result.add(createRestModel(workspaceMaterial));
    }
    
    return result.toArray(new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial[0]);
  }
  
  private fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial createRestModel(WorkspaceMaterial workspaceMaterial) {
    WorkspaceNode workspaceNode = workspaceMaterialController.findWorkspaceNodeNextSibling(workspaceMaterial);
    Long nextSiblingId = workspaceNode != null ? workspaceNode.getId() : null;
    
    return new fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceMaterial(workspaceMaterial.getId(), workspaceMaterial.getMaterialId(),
        workspaceMaterial.getParent() != null ? workspaceMaterial.getParent().getId() : null, nextSiblingId, workspaceMaterial.getHidden(), 
        workspaceMaterial.getAssignmentType(), workspaceMaterial.getCorrectAnswers(), workspaceMaterial.getPath(), workspaceMaterial.getTitle());
  }
  
}
