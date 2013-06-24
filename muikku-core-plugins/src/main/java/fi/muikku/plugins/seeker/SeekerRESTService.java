package fi.muikku.plugins.seeker;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import fi.muikku.plugin.PluginRESTService;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelType;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;

@Path("/seeker")
@RequestScoped
@Stateful
@Produces ("application/json")
public class SeekerRESTService extends PluginRESTService {

  @Inject 
  private TranquilityBuilderFactory tranquilityBuilderFactory;

  @Inject
  private SessionController sessionController;

  @Inject
  @Any
  private Instance<SeekerResultProvider> seekerResultProviders;
  
  @GET
  @Path ("/search")
  public Response search(
      @QueryParam("searchString") String searchString
      ) {
    List<SeekerResult> results = new ArrayList<SeekerResult>();
    
    for (SeekerResultProvider provider : seekerResultProviders) {
      List<SeekerResult> result = provider.search(searchString);
      
      results.addAll(result);
    }
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
      .addInstruction(tranquilityBuilder.createPropertyTypeInstruction(TranquilModelType.COMPLETE));
    
    return Response.ok(
      tranquility.entities(results)
    ).build();
  }


}
