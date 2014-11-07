package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;
import fi.muikku.plugins.material.model.HtmlMaterial;

@RequestScoped
@Path("/materials/binary")
@Stateful
@Produces ("application/json")
public class BinaryMaterialRESTService extends PluginRESTService {
	@Inject
	private BinaryMaterialController binaryMaterialController;
	
	@GET
	@Path ("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findMaterial(@PathParam("id") long id) {
	  BinaryMaterial material = binaryMaterialController.finBinaryMaterialById(id);
	  if (material == null) {
	    return Response.status(Status.NOT_FOUND).build();
	  } else {
      return Response.ok().entity(new BinaryRestMaterial(id, material.getContentType())).build();
	  }
	}
	
	@GET
	@Path("/{id}/content")
	public Response getMaterialContent(@PathParam("id") long id) {
	  BinaryMaterial material = binaryMaterialController.finBinaryMaterialById(id);
	  if (material == null) {
	    return Response.status(Status.NOT_FOUND).build();
	  } else {
      return Response.ok()
                     .type(material.getContentType())
                     .entity(material.getContent())
                     .build();
	  }
	}
}
