package fi.otavanopisto.muikku.plugins.feed;

import java.util.ArrayList;
import java.util.Arrays;
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

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem;
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

  @Inject
  private FeedItemDAO feedItemDao;
  
  @GET
  @Path("/feeds/{NAMES}")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response findFeedByNames(
      @PathParam("NAMES") String names,
      @QueryParam("numItems") @DefaultValue("10") int numItems) {
    List<String> namesList = Arrays.asList(names.split(","));
    
    if (namesList.size() == 0) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    List<Feed> feeds = new ArrayList<>();
    
    for (String name : namesList) {
      Feed feed = feedDao.findByName(name);
      if (feed == null) {
        return Response
            .status(Status.NOT_FOUND)
            .entity("Feed not found: " + name)
            .build();
      }
      feeds.add(feedDao.findByName(name));
    }
    
    List<FeedItem> feedItems = feedItemDao.findByFeeds(feeds, numItems);
    
    return Response.ok(feedItems).build();
  }
}
