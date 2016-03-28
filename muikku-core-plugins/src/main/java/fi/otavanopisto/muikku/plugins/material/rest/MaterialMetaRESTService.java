package fi.otavanopisto.muikku.plugins.material.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.MaterialMeta;
import fi.otavanopisto.muikku.plugins.material.model.MaterialMetaKey;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@RequestScoped
@Path("/materials")
@Stateful
@Produces("application/json")
public class MaterialMetaRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5126862097206188803L;

  @Inject
  private MaterialController materialController;
  
  @Inject
  private SessionController sessionController;
  
  @GET
  @Path("/metakeys")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
  public Response listMaterialMetaKeys() {
    List<MaterialMetaKey> materialMetaKeys = materialController.listMaterialMetaKeys();
    
    List<String> result = new ArrayList<>(materialMetaKeys.size());
    for (MaterialMetaKey materialMetaKey : materialMetaKeys) {
      result.add(materialMetaKey.getName());
    }
    
    return Response.ok(result).build();
  }

  @POST
  @Path("/materials/{id}/meta")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
  public Response createMaterialMeta(@PathParam("id") Long id, fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIAL_META)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    if (StringUtils.isBlank(payload.getKey())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing key").build();
    }
    
    MaterialMetaKey key = materialController.findMaterialMetaKey(payload.getKey());
    if (key == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid key").build();
    }
    
    return Response.ok(createRestModel(materialController.createMaterialMeta(material, key, payload.getValue()))).build();
  }

  @GET
  @Path("/materials/{id}/meta/")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
  public Response listMaterialMetas(@PathParam("id") Long id) {
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    List<MaterialMeta> metas = materialController.listMaterialMetas(material);
    if (metas.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(createRestModel(metas.toArray(new MaterialMeta[0]))).build();
  }
  
  @GET
  @Path("/materials/{id}/meta/{KEY}")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
  public Response findMaterialMeta(@PathParam("id") Long id, @PathParam("KEY") String key) {
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    MaterialMetaKey materialMetaKey = materialController.findMaterialMetaKey(key);
    if (materialMetaKey == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid key").build();
    }
    
    MaterialMeta materialMeta = materialController.findMaterialMeta(material, materialMetaKey);
    if (materialMeta == null) {
      return Response.status(Status.NOT_FOUND).entity("Material meta not found").build();
    }
    
    return Response.ok(createRestModel(materialMeta)).build();
  }
  
  @PUT
  @Path("/materials/{id}/meta/{KEY}")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
  public Response updateMaterialMeta(@PathParam("id") Long id, @PathParam("KEY") String key, fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.MANAGE_MATERIAL_META)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (payload.getKey() != null && !StringUtils.equals(payload.getKey(), key)) {
      return Response.status(Status.BAD_REQUEST).entity("Can not update material meta key").build();
    }

    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    MaterialMetaKey materialMetaKey = materialController.findMaterialMetaKey(key);
    if (materialMetaKey == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid key").build();
    }
    
    MaterialMeta materialMeta = materialController.findMaterialMeta(material, materialMetaKey);
    if (materialMeta == null) {
      return Response.status(Status.BAD_REQUEST).entity("MaterialMeta not found").build();
    }
    
    return Response.ok(createRestModel(materialController.updateMaterialMeta(materialMeta, payload.getValue()))).build();
  }
  
  private fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta createRestModel(fi.otavanopisto.muikku.plugins.material.model.MaterialMeta materialMeta) {
    return new fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta(materialMeta.getMaterial().getId(), materialMeta.getKey().getName(), materialMeta.getValue());
  }

  private List<fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta> createRestModel(MaterialMeta... entries) {
    List<fi.otavanopisto.muikku.plugins.material.rest.MaterialMeta> result = new ArrayList<>();

    for (MaterialMeta entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
}
