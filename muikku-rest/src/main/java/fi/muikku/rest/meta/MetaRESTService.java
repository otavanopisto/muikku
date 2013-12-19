package fi.muikku.rest.meta;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.core.Dispatcher;
import org.jboss.resteasy.core.ResourceMethodRegistry;

import fi.muikku.rest.AbstractRESTService;

@Path("/meta")
@Produces("application/json")
public class MetaRESTService extends AbstractRESTService {

  @Context
  private Dispatcher dispatcher;

  @GET
  @Path("/resources")
  public Response getResources() {
    List<String> resources = new ArrayList<>();

    ResourceMethodRegistry registry = (ResourceMethodRegistry) dispatcher.getRegistry();
    Set<Entry<String, java.util.List<org.jboss.resteasy.core.ResourceInvoker>>> entries = registry.getRoot().getBounded().entrySet();
    for (Entry<String, java.util.List<org.jboss.resteasy.core.ResourceInvoker>> entry : entries) {
      String path = entry.getKey();
      resources.add(path);
    }
    
    Collections.sort(resources);
    
    return Response
      .ok(resources)
      .build();
  }

}
