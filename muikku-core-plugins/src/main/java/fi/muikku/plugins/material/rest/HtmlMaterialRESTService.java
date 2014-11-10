package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.w3c.dom.Document;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;

@RequestScoped
@Path("/materials/html")
@Stateful
@Produces("application/json")
public class HtmlMaterialRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 5678403648328971273L;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @GET
  @Path("/{id}")
  public Response findMaterial(@PathParam("id") long id) {
    HtmlMaterial material = htmlMaterialController.findHtmlMaterialById(id);
    if (material == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      try {
        Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(material);
        String html = htmlMaterialController.getSerializedHtmlDocument(processedHtmlDocument, material);
        return Response.ok().entity(new HtmlRestMaterial(id, html)).build();
      } catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).build();
      }
    }
  }
}
