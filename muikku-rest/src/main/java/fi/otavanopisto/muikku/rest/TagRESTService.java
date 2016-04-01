package fi.otavanopisto.muikku.rest;

import javax.ejb.Stateless;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("/tags")
@Stateless
@Produces ("application/json")
public class TagRESTService extends AbstractRESTService {
// FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private TagController tagController;
//  
//  @GET
//  @Path ("/searchTags")
//  public Response searchTags(
//      @QueryParam("searchString") String searchString
//      ) {
//    
//    List<Tag> tags = tagController.searchTags(searchString);
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entities(tags)
//    ).build();
//  }
//

}
