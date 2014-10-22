package fi.muikku.plugins.seeker;

import java.util.ArrayList;
import java.util.Iterator;
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

@Path("/seeker")
@RequestScoped
@Stateful
@Produces("application/json")
public class SeekerRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;

  @Inject
  @Any
  private Instance<SeekerResultProvider> seekerResultProviders;

  @GET
  @Path("/search")
  public Response search(@QueryParam("searchString") String searchString) {
    List<SeekerResult> results = new ArrayList<SeekerResult>();
    Iterator<SeekerResultProvider> i = seekerResultProviders.iterator();
    while (i.hasNext()) {
      SeekerResultProvider provider = i.next();
      List<SeekerResult> result = provider.search(searchString);
      if (result != null) {
        results.addAll(result);
      }
    }
    return Response.ok(results).build();
  }

}
