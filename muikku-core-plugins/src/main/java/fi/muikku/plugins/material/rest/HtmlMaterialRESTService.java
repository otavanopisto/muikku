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
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;

@RequestScoped
@Path("/materials/html")
@Stateful
@Produces ("application/json")
public class HtmlMaterialRESTService extends PluginRESTService {
	@Inject
	private HtmlMaterialController htmlMaterialController;
	
	@GET
	@Path ("/{id}")
	public Response findMaterial(@PathParam("id") long id) {
	  HtmlMaterial material = htmlMaterialController.findHtmlMaterialById(id);
	  if (material == null) {
	    return Response.status(Status.NOT_FOUND).build();
	  } else {
      return Response.ok().entity(new HtmlRestMaterial(id, material.getHtml())).build();
	  }
	}
}
