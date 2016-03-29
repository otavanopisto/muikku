package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.EntityCacheStatistics;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.EntityCacheStatistics.Statistics;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/system/pyramus")
@Produces("application/json")
public class PyramusSystemRESTService extends PluginRESTService {

  private static final long serialVersionUID = -6277887422925061715L;

  @Inject
  private EntityCacheStatistics entityCacheStatistics;

  @GET
  @Path("/cache/statistics")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response ping() {
    
    Map<String, Map<String, CachePathStatistics>> result = new HashMap<>();

    for (String cacheType : entityCacheStatistics.getCacheTypes()) {
      Statistics statistics = entityCacheStatistics.getStatistics(cacheType);

      Map<String, CachePathStatistics> pathStatistics = new HashMap<>();
      
      for (String path : statistics.getPaths()) {
        pathStatistics.put(path, new CachePathStatistics(
            statistics.getHits(path), 
            statistics.getMisses(path), 
            statistics.getSkips(path)));
      }
      
      result.put(cacheType, pathStatistics);
    }

    return Response.ok(result).build();
  }

  public static class CachePathStatistics {

    public CachePathStatistics(int hits, int misses, int skips) {
      super();
      this.hits = hits;
      this.misses = misses;
      this.skips = skips;
    }

    public int getHits() {
      return hits;
    }

    public void setHits(int hits) {
      this.hits = hits;
    }

    public int getMisses() {
      return misses;
    }

    public void setMisses(int misses) {
      this.misses = misses;
    }

    public int getSkips() {
      return skips;
    }

    public void setSkips(int skips) {
      this.skips = skips;
    }

    private int hits;
    private int misses;
    private int skips;
  }

}
