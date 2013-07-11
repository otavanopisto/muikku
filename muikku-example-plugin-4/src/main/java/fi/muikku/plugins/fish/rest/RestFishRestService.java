package fi.muikku.plugins.fish.rest;

import java.util.Random;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.fish.RestFishController;

@RequestScoped
@Path("/fish")
@Produces("application/json")
public class RestFishRestService extends PluginRESTService {
  
  @Inject
  private RestFishController restFishController;
  
  @GET
  @Path("/messages")
  public Response listMessages() {
    return Response.ok(restFishController.getTexts()).build();
  }
  
  @GET
  @Path("/messages/{index: [0-9]+}")
  public Response getMessage(@PathParam("index") int index) {
    int count = restFishController.getCount();
    if (index < 0 || index >= count) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(restFishController.getText(index)).build();
  }
  
  @GET
  @Path("/messages/random")
  public Response getRandomMessage() {
    int index = new Random().nextInt(restFishController.getCount());
    return Response.ok(restFishController.getText(index)).build();
  }
}