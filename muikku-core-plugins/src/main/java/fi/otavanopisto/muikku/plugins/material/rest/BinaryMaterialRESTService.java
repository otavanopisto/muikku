package fi.otavanopisto.muikku.plugins.material.rest;

import java.io.IOException;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;

@RequestScoped
@Path("/materials/binary")
@Stateful
@Produces("application/json")
public class BinaryMaterialRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5126862097206188803L;

  @Inject
  private BinaryMaterialController binaryMaterialController;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  private boolean isAuthorized() {
      if (!sessionController.isLoggedIn()) {
        return false;
      }
      
      UserEntity userEntity = sessionController.getLoggedUserEntity();
      
      EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
      
      if (environmentUser.getRole() == null || environmentUser.getRole().getArchetype() == EnvironmentRoleArchetype.STUDENT) {
        return false;
      }
      
      return true;
  }

  @POST
  @Path("/")
  @RESTPermitUnimplemented
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
        entity.getTitle(), entity.getContentType(), content, entity.getLicense());

    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      return Response.ok(createRestModel(material)).build();
    }
  }

  @GET
  @Path("/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  @RESTPermitUnimplemented
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
  @RESTPermitUnimplemented
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
  @RESTPermitUnimplemented
  public Response downloadMaterialContent(@PathParam("id") Long id) {
    BinaryMaterial material = binaryMaterialController.findBinaryMaterialById(id);
    
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      String urlName = StringUtils.stripAccents(StringUtils.lowerCase(material.getTitle())).replaceAll("[^a-z0-9\\-\\.\\_]", "");
      if (StringUtils.isBlank(urlName)) {
        urlName = String.valueOf(material.getId());
      }
      
      return Response.ok(material.getContent())
        .header("Content-Length", material.getContent().length)
        .header("Content-Disposition", String.format("attachment; filename=\"%s\"", urlName))
        .type(material.getContentType())
        .build();
    }
  }

  @DELETE
  @Path("/{id}")
  @RESTPermitUnimplemented
  public Response deleteMaterial(@PathParam("id") Long id) {
    BinaryMaterial binaryMaterial = binaryMaterialController.findBinaryMaterialById(id);
    if (binaryMaterial != null) {
      binaryMaterialController.deleteBinaryMaterial(binaryMaterial);
      return Response.noContent().build();
    } else {
      return Response.status(Status.NOT_FOUND).build();
    }
  }
  
  private BinaryRestMaterial createRestModel(BinaryMaterial material) {
    return new BinaryRestMaterial(material.getId(), null, material.getTitle(), material.getContentType(), material.getLicense());
  }
  
}
