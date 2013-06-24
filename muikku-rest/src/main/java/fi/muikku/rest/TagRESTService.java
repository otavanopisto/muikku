package fi.muikku.rest;

import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.controller.TagController;
import fi.muikku.model.base.Tag;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;

@Path("/tags")
@Stateless
@Produces ("application/json")
public class TagRESTService extends AbstractRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private TagController tagController;
  
  @GET
  @Path ("/searchTags")
  public Response searchTags(
      @QueryParam("searchString") String searchString
      ) {
    
    List<Tag> tags = tagController.searchTags(searchString);
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entities(tags)
    ).build();
  }


}
