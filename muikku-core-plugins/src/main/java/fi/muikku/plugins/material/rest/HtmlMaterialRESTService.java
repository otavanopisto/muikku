package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
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

  @POST
  @Path("/")
  public Response createMaterial(HtmlRestMaterial entity) {
    if (StringUtils.isBlank(entity.getContentType())) {
      return Response.status(Status.BAD_REQUEST).entity("contentType is missing").build();
    }
    
    if (StringUtils.isBlank(entity.getTitle())) {
      return Response.status(Status.BAD_REQUEST).entity("title is missing").build();
    }
    
    HtmlMaterial htmlMaterial = htmlMaterialController.createHtmlMaterial(entity.getTitle(), entity.getHtml(), entity.getContentType(), 0l);
    try {
      String html = null;
      if (StringUtils.isNoneBlank(htmlMaterial.getHtml())) {
        Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(htmlMaterial);
        html = htmlMaterialController.getSerializedHtmlDocument(processedHtmlDocument, htmlMaterial);
      }
      
      return Response.ok(new HtmlRestMaterial(htmlMaterial.getId(), htmlMaterial.getTitle(), htmlMaterial.getContentType(), html)).build();
    } catch (Exception e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @GET
  @Path("/{id}")
  public Response findMaterial(@PathParam("id") Long id) {
    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(id);
    if (htmlMaterial == null) {
      return Response.status(Status.NOT_FOUND).build();
    } else {
      try {
        String html = null;
        if (StringUtils.isNoneBlank(htmlMaterial.getHtml())) {
          Document processedHtmlDocument = htmlMaterialController.getProcessedHtmlDocument(htmlMaterial);
          html = htmlMaterialController.getSerializedHtmlDocument(processedHtmlDocument, htmlMaterial);
        }
        
        return Response.ok(new HtmlRestMaterial(htmlMaterial.getId(), htmlMaterial.getTitle(), htmlMaterial.getContentType(), html)).build();
      } catch (Exception e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    }
  }
}
