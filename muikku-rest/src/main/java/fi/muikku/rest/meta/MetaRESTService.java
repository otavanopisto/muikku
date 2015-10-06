package fi.muikku.rest.meta;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;
import org.jboss.resteasy.core.Dispatcher;
import org.jboss.resteasy.core.ResourceMethodRegistry;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.muikku.rest.AbstractRESTService;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/meta")
@Produces("application/json")
public class MetaRESTService extends AbstractRESTService {
  
  private static final String ETAG = UUID.randomUUID().toString();

  @Context
  private Dispatcher dispatcher;

  @GET
  @Path("/resources")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response getResources(@Context Request request, @QueryParam ("format") String format) {
    EntityTag tag = new EntityTag(ETAG);
    
    ResponseBuilder builder = request.evaluatePreconditions(tag);
    if (builder != null) {
      return builder.build();
    }
    
    List<String> resources = new ArrayList<>();

    ResourceMethodRegistry registry = (ResourceMethodRegistry) dispatcher.getRegistry();

    Set<Entry<String, java.util.List<org.jboss.resteasy.core.ResourceInvoker>>> entries = registry.getBounded().entrySet();
    for (Entry<String, java.util.List<org.jboss.resteasy.core.ResourceInvoker>> entry : entries) {
      String path = entry.getKey();
      resources.add(path);
    }
    
    CacheControl cacheControl = new CacheControl();
    cacheControl.setMaxAge(-1);
    cacheControl.setPrivate(false);
    cacheControl.setMustRevalidate(false);
    
    Collections.sort(resources);
    
    if (StringUtils.isNotBlank(format) && "js".equals(format)) {
      try {
        return Response
         .ok(String.format("var META_RESOURCES = %s", new ObjectMapper().writeValueAsString(resources)), "text/javascript")
         .cacheControl(cacheControl)
         .tag(tag)
         .build();
      } catch (JsonProcessingException e) {
        return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
      }
    } else {
      return Response
        .ok(resources)
        .cacheControl(cacheControl)
        .tag(tag)
        .build();
    }
  }

}
