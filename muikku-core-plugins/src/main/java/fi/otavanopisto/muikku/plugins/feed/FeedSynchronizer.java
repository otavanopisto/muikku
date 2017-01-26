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
    Client client = ClientBuilder.newClient();

    List<Feed> feeds = feedDao.listAll();

    for (Feed feed : feeds) {
      logger.info(String.format("Synchronizing feed: %s", feed.getName()));
      WebTarget target = client.target(feed.getUrl());
      String result = target.request("*").get(String.class);
      feedDao.updateContent(feed, result);
    }
  }
}
