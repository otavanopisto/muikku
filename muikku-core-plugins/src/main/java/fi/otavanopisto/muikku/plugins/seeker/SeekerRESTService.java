package fi.otavanopisto.muikku.plugins.seeker;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.TreeMap;

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

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;

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
  @RESTPermitUnimplemented
  public Response search(@QueryParam("searchString") String searchString) {
    TreeMap<Integer, List<SeekerResult>> sortedResults = new TreeMap<Integer, List<SeekerResult>>();
    Iterator<SeekerResultProvider> i = seekerResultProviders.iterator();
    while (i.hasNext()) {
      SeekerResultProvider provider = i.next();
      List<SeekerResult> result = provider.search(searchString);
      if (result != null) {
        for(SeekerResult item : result){
          item.setCategory(provider.getName()); //TODO: add localization
        }
        if(sortedResults.containsKey(provider.getWeight())){
          sortedResults.get(provider.getWeight()).addAll(result);
        }else{
          sortedResults.put(provider.getWeight(), result);
        }
      }
    }
    return Response.ok(toResultArray(sortedResults)).build();
  }
  
  private List<SeekerResult> toResultArray(TreeMap<Integer, List<SeekerResult>> resultMap){
    List<SeekerResult> results = new ArrayList<SeekerResult>();
    for(Entry<Integer, List<SeekerResult>> result : resultMap.entrySet()){
      results.addAll(result.getValue());
    }
    return results;
  }

}
