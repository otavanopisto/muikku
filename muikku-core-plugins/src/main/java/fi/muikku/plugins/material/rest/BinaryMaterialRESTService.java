package fi.muikku.plugins.material.rest;

import java.io.IOException;
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
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;

import fi.muikku.files.TempFileUtils;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.MaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.MaterialMeta;
import fi.muikku.plugins.material.model.MaterialMetaKey;
import fi.muikku.session.SessionController;
import fi.muikku.users.EnvironmentUserController;

@RequestScoped
@Path("/materials/binary")
@Stateful
@Produces("application/json")
public class BinaryMaterialRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5126862097206188803L;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Inject
  private MaterialController materialController;
  
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

  @POST
  @Path("/")
  public Response createMaterial(BinaryRestMaterial entity) {
    
    if (!isAuthorized()) {
      return Response.status(Status.FORBIDDEN).entity("Permission denied").build();
    }

    if (StringUtils.isBlank(entity.getContentType())) {
      return Response.status(Status.BAD_REQUEST)
          .entity("contentType is missing").build();
    }

    if (StringUtils.isBlank(entity.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("title is missing")
          .build();
    }

    if (StringUtils.isBlank(entity.getFileId())) {
      return Response.status(Status.BAD_REQUEST).entity("fileId is missing")
          .build();
    }

    byte[] content = null;
    try {
      content = TempFileUtils.getTempFileData(entity.getFileId());
    } catch (IOException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR)
          .entity(e.getMessage()).build();
    }

    if (content == null) {
      return Response.status(Status.BAD_REQUEST).entity("fileId is invalid")
          .build();
    }

    BinaryMaterial material = binaryMaterialController.createBinaryMaterial(
        entity.getTitle(), entity.getContentType(), content);

    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      return Response.ok(createRestModel(material)).build();
    }
  }

  @GET
  @Path("/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response findMaterial(@PathParam("id") Long id) {
    BinaryMaterial material = binaryMaterialController.findBinaryMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      return Response.ok(createRestModel(material)).build();
    }
  }

  @GET
  @Path("/{id}/content")
  public Response getMaterialContent(@PathParam("id") Long id, @Context Request request) {
    BinaryMaterial material = binaryMaterialController.findBinaryMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      EntityTag tag = new EntityTag(DigestUtils.md5Hex(String.valueOf(material.getVersion())));
      ResponseBuilder builder = request.evaluatePreconditions(tag);
      if (builder != null) {
        return builder.build();
      }

      CacheControl cacheControl = new CacheControl();
      cacheControl.setMustRevalidate(true);
      
      return Response.ok(material.getContent())
          .cacheControl(cacheControl)
          .tag(tag)
          .type(material.getContentType())
          .build();
    }
  }

  @GET
  @Path("/{id}/download")
  public Response downloadMaterialContent(@PathParam("id") Long id) {
    BinaryMaterial material = binaryMaterialController.findBinaryMaterialById(id);
    
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      // TODO: Better file name
      return Response.ok(material.getContent())
        .header("Content-Length", material.getContent().length)
        .header("Content-Disposition", "attachment; filename=\""+ material.getId() + "\"")
        .type(material.getContentType())
        .build();
    }
  }
  
  private BinaryRestMaterial createRestModel(BinaryMaterial material) {
    return new BinaryRestMaterial(material.getId(), null, material.getTitle(), material.getContentType());
  }

  @DELETE
  @Path("/{id}")
  public Response deleteMaterial(@PathParam("id") Long id) {
    BinaryMaterial binaryMaterial = binaryMaterialController.findBinaryMaterialById(id);
    if (binaryMaterial != null) {
      binaryMaterialController.deleteBinaryMaterial(binaryMaterial);
      return Response.noContent().build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  @POST
  @Path("/{id}/meta")
  @Produces(MediaType.APPLICATION_JSON)
  public Response createMaterialMeta(@PathParam("id") Long id, fi.muikku.plugins.material.rest.MaterialMeta payload) {
    // TODO: Security!!
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    if (!(material instanceof BinaryMaterial)) {
      return Response.status(Status.NOT_FOUND).entity("Material is not binary material").build();
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
  @Path("/{id}/meta")
  @Produces(MediaType.APPLICATION_JSON)
  public Response listMaterialMetas(@PathParam("id") Long id) {
    // TODO: Security!!
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    if (!(material instanceof BinaryMaterial)) {
      return Response.status(Status.NOT_FOUND).entity("Material is not binary material").build();
    }
    
    List<MaterialMeta> metas = materialController.listMaterialMetas(material);
    if (metas.isEmpty()) {
      return Response.noContent().build();
    }
    
    return Response.ok(createRestModel(metas.toArray(new MaterialMeta[0]))).build();
  }
  
  @GET
  @Path("/{id}/meta/{KEY}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response findMaterialMeta(@PathParam("id") Long id, @PathParam("KEY") String key) {
    // TODO: Security!!
    
    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    if (!(material instanceof BinaryMaterial)) {
      return Response.status(Status.NOT_FOUND).entity("Material is not binary material").build();
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
  @Path("/{id}/meta/{KEY}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateMaterialMeta(@PathParam("id") Long id, @PathParam("KEY") String key, fi.muikku.plugins.material.rest.MaterialMeta payload) {
    // TODO: Security!!
    
    if (payload.getKey() != null && !StringUtils.equals(payload.getKey(), key)) {
      return Response.status(Status.BAD_REQUEST).entity("Can not update material meta key").build();
    }

    Material material = materialController.findMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).entity("Material not found").build();
    }
    
    if (!(material instanceof BinaryMaterial)) {
      return Response.status(Status.NOT_FOUND).entity("Material is not binary material").build();
    }
    
    if (StringUtils.isBlank(payload.getKey())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing key").build();
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
  
  private fi.muikku.plugins.material.rest.MaterialMeta createRestModel(fi.muikku.plugins.material.model.MaterialMeta materialMeta) {
    return new fi.muikku.plugins.material.rest.MaterialMeta(materialMeta.getMaterial().getId(), materialMeta.getKey().getName(), materialMeta.getValue());
  }

  private List<fi.muikku.plugins.material.rest.MaterialMeta> createRestModel(MaterialMeta... entries) {
    List<fi.muikku.plugins.material.rest.MaterialMeta> result = new ArrayList<>();

    for (MaterialMeta entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
}
