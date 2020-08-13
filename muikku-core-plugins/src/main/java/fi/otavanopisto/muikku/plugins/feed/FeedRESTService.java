package fi.otavanopisto.muikku.plugins.feed;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

import org.apache.commons.lang3.StringUtils;

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

  private static final long serialVersionUID = -10681497398136513L;

  @Inject
  private FeedDAO feedDAO;

  @Inject
  private FeedItemDAO feedItemDao;
  
  @GET
  @Path("/feeds/{NAMES}")
  @RESTPermit(handling = Handling.UNSECURED)
  public Response findFeedByNames(
      @PathParam("NAMES") String names,
      @QueryParam("numItems") @DefaultValue("10") int numItems,
      @QueryParam("order") @DefaultValue("DESCENDING") FeedSortOrder order) {
    
    if (StringUtils.isBlank(names)) {
      return Response.status(Status.NOT_FOUND).build();
    }

    Set<String> nameSet = Stream.of(names.split(",")).collect(Collectors.toSet());
    List<Feed> feeds = new ArrayList<>();
    
    for (String name : nameSet) {
      Feed feed = feedDAO.findByName(name);
      if (feed != null) {
        feeds.add(feed);
      }
    }
    
    List<FeedItem> feedItems = feedItemDao.findByFeeds(feeds, numItems, order);
    List<FeedRestItem> feedRestItems = new ArrayList<FeedRestItem>();
    for (FeedItem feedItem : feedItems) {
      FeedRestItem feedRestItem = new FeedRestItem();
      feedRestItem.setAuthor(feedItem.getAuthor());
      feedRestItem.setDescription(feedItem.getDescription());
      feedRestItem.setFeed(feedItem.getFeed().getName());
      feedRestItem.setImage(feedItem.getImage());
      feedRestItem.setLink(feedItem.getLink());
      feedRestItem.setPublicationDate(feedItem.getPublicationDate());
      feedRestItem.setTitle(feedItem.getTitle());
      feedRestItems.add(feedRestItem);
    }
    
    return Response.ok(feedRestItems).build();
  }

}