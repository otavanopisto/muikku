package fi.muikku.plugins.material.rest;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import fi.muikku.plugin.PluginRESTService;

@RequestScoped
@Path("/materials")
@Stateful
@Produces ("application/json")
public class MaterialRESTService extends PluginRESTService {
// FIXME: Re-enable this service
//
//	@SuppressWarnings("cdi-ambiguous-dependency")
//	@Inject
//	private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//	@Inject
//	private HtmlMaterialController htmlMaterialController;
//	
//	// 
//	// HtmlMaterial 
//	// 
//	
//	@POST
//	@Path ("/html/")
//	public Response createHtmlMaterial(HtmlMaterialCompact htmlMaterial) {
//	  if (htmlMaterial.getId() != null) {
//      return Response.status(Status.BAD_REQUEST).entity("id can not be specified when creating new HtmlMaterial").build();
//    }
//	  
//	  if (StringUtils.isBlank(htmlMaterial.getHtml())) {
//      return Response.status(Status.BAD_REQUEST).entity("html is required when creating new HtmlMaterial").build();
//    }
//	  
//	  if (StringUtils.isBlank(htmlMaterial.getTitle())) {
//      return Response.status(Status.BAD_REQUEST).entity("title is required when creating new HtmlMaterial").build();
//    }
//	  
//	  if (StringUtils.isBlank(htmlMaterial.getUrlName())) {
//      return Response.status(Status.BAD_REQUEST).entity("urlName is required when creating new HtmlMaterial").build();
//    }
//	  
//    return Response.ok(
//        tranquilityBuilderFactory.createBuilder()
//          .createTranquility()
//          .entity(htmlMaterialController.createHtmlMaterial(htmlMaterial.getUrlName(), htmlMaterial.getTitle(), htmlMaterial.getHtml()))
//    ).build();
//	}
//	
//	@DELETE
//  @Path ("/html/{ID}")
//	public Response deleteHtmlMaterial(@PathParam ("ID") Long htmlMaterialId) {
//	  // TODO: Security
//    
//    if (htmlMaterialId == null) {
//      return Response.status(Status.NOT_FOUND).entity("Html material not found").build();
//    }
//    
//    HtmlMaterial htmlMaterial = htmlMaterialController.findHtmlMaterialById(htmlMaterialId);
//    if (htmlMaterial == null) {
//      return Response.status(Status.NOT_FOUND).entity("Html material not found").build();
//    }
//    
//    htmlMaterialController.deleteHtmlMaterial(htmlMaterial);
//    
//    return Response.noContent().build();
//	}
//  
}
