package fi.muikku.plugins.seeker;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import fi.muikku.plugin.PluginRESTService;

@Path("/seeker")
@RequestScoped
@Stateful
@Produces ("application/json")
public class SeekerRESTService extends PluginRESTService {

//FIXME: Re-enable this service
//
//  @Inject 
//  private TranquilityBuilderFactory tranquilityBuilderFactory;
//
//  @Inject
//  private SessionController sessionController;
//
//  @Inject
//  @Any
//  private Instance<SeekerResultProvider> seekerResultProviders;
//  
//  @GET
//  @Path ("/search")
//  public Response search(
//      @QueryParam("searchString") String searchString
//      ) {
//    List<SeekerResult> results = new ArrayList<SeekerResult>();
//    
//    for (SeekerResultProvider provider : seekerResultProviders) {
//      List<SeekerResult> result = provider.search(searchString);
//      if (result != null) {
//        results.addAll(result);
//      }
//    }
//    
//    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
//    Tranquility tranquility = tranquilityBuilder.createTranquility()
//      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
//    
//    return Response.ok(
//      tranquility.entities(results)
//    ).build();
//  }
//

}
