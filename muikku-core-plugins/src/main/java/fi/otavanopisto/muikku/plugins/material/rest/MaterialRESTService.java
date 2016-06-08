package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

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
  
  @GET
  @Path("/material/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findMaterial(@PathParam ("ID") Long id) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Material %d not found", id)).build();
    }
    
    return Response.ok(createRestModel(material)).build();
  }
  
  @PUT
  @Path("/material/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateMaterial(@PathParam ("ID") Long id, RestMaterial payload) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIALS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Material %d not found", id)).build();
    }
    
    if (StringUtils.isNotBlank(payload.getTitle()) && !StringUtils.equals(payload.getTitle(), material.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("Refused to update title via this REST endpoint").build();
    }
    
    materialController.updateMaterialLicense(material, payload.getLicense());

    return Response.ok(createRestModel(material)).build();
  }
  
  @POST
  @Path("/material/{MATERIALID}/producers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialProducer(@PathParam("MATERIALID") Long materialId, MaterialProducer payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIAL_PRODUCERS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    if (StringUtils.isBlank(payload.getName())) {
      return Response.status(Status.BAD_REQUEST).entity("Name is required").build();
    }
      
    Material material = materialController.findMaterialById(materialId);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Material %d not found", materialId)).build();
    }
    
    return Response
      .ok(createRestModel(materialController.createMaterialProducer(material, payload.getName())))
      .build();
  } 

  @GET
  @Path("/material/{MATERIALID}/producers")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = false)
  public Response listWorkspaceMaterialProducers(@PathParam("MATERIALID") Long materialId) {
    Material material = materialController.findMaterialById(materialId);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Material %d not found", materialId)).build();
    }
    
    return Response
      .ok(createRestModel(materialController.listMaterialProducers(material).toArray(new fi.otavanopisto.muikku.plugins.material.model.MaterialProducer[0])))
      .build();
  }  
  
  @DELETE
  @Path("/material/{MATERIALID}/producers/{PRODUCERID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceMaterialProducer(@PathParam("MATERIALID") Long materialId, @PathParam("PRODUCERID") Long producerId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).entity("Not logged in").build();
    }
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIAL_PRODUCERS)) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }
    
    Material material = materialController.findMaterialById(materialId);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Material %d not found", materialId)).build();
    }
    
    fi.otavanopisto.muikku.plugins.material.model.MaterialProducer materialProducer = materialController.findMaterialProducer(producerId);
    materialController.deleteMaterialProducer(materialProducer);
    
    return Response
      .noContent()
      .build();
  } 

  private List<MaterialProducer> createRestModel(fi.otavanopisto.muikku.plugins.material.model.MaterialProducer... producers) {
    List<MaterialProducer> result = new ArrayList<>();
    
    for (fi.otavanopisto.muikku.plugins.material.model.MaterialProducer producer : producers) {
      result.add(createRestModel(producer));
    }
    
    return result;
  }
  
  private MaterialProducer createRestModel(fi.otavanopisto.muikku.plugins.material.model.MaterialProducer entity) {
    Long materialId = entity.getMaterial() != null ? entity.getMaterial().getId() : null;
    return new MaterialProducer(entity.getId(), entity.getName(), materialId);
  } 

  private RestMaterial createRestModel(Material material) {
    return new RestMaterial(material.getId(), material.getTitle(), material.getLicense());
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
