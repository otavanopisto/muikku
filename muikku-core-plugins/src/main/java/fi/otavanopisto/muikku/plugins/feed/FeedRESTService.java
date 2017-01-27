package fi.otavanopisto.muikku.plugins.feed;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/feed")
@RequestScoped
@Stateful
@Produces ("application/json")
public class FeedRESTService extends PluginRESTService {

  private static final long serialVersionUID = -7027696842893383409L;

  @Inject
  private FeedDAO feedDao;
  
  @GET
  @Path("/feeds/{NAME}")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response findFeedByName(
      @PathParam("NAME") String name,
      @QueryParam("numEntries") @DefaultValue("10") int numEntries) {
    Feed feed = feedDao.findByName(name);
    
    if (feed == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (feed.getContent() == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    SyndFeedInput input = new SyndFeedInput();
    
    try (Reader reader = new StringReader(feed.getContent())) {
      SyndFeed syndFeed = input.build(reader);
      
      List<SyndEntry> entries = syndFeed.getEntries();
      
      return Response.ok(entries.subList(0, Math.min(numEntries, entries.size()))).build();
    } catch (IOException | IllegalArgumentException | FeedException e) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
}
