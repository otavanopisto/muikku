package fi.otavanopisto.muikku.plugins.feed;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import fi.otavanopisto.muikku.plugins.feed.model.Feed;

@Stateless
public class FeedSynchronizer {

  @Inject
  private FeedDAO feedDao;

  @Inject
  private Logger logger;

  @Schedule(second = "0", minute = "*", hour = "*")
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateFeeds() {
    logger.info("Updating feeds...");
    Client client = ClientBuilder.newClient();

    List<Feed> feeds = feedDao.listAll();
    
    logger.info(String.format("Number of feeds: %d", feeds.size()));

    for (Feed feed : feeds) {
      WebTarget target = client.target(feed.getUrl());
      String result = target.request("*").get(String.class);
      feedDao.updateContent(feed, result);
    }
  }
}
