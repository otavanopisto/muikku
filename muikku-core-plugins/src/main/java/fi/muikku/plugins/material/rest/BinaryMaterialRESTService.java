package fi.muikku.plugins.material.rest;

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
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.files.TempFileUtils;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;

@RequestScoped
@Path("/materials/binary")
@Stateful
@Produces("application/json")
public class BinaryMaterialRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5126862097206188803L;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @POST
  @Path("/")
  public Response createMaterial(BinaryRestMaterial entity) {
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
    BinaryMaterial material = binaryMaterialController
        .findBinaryMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      return Response.ok(createRestModel(material)).build();
    }
  }

  @GET
  @Path("/{id}/content")
  public Response getMaterialContent(@PathParam("id") Long id) {
    BinaryMaterial material = binaryMaterialController
        .findBinaryMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      return Response.ok().type(material.getContentType())
          .entity(material.getContent()).build();
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
}
