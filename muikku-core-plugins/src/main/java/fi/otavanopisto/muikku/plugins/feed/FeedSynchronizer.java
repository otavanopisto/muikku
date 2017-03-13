package fi.otavanopisto.muikku.plugins.feed;

import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.EJBContext;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.FeedException;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

import fi.otavanopisto.muikku.plugins.feed.model.Feed;

@Stateless
public class FeedSynchronizer {

  @Inject
  private FeedDAO feedDao;

  @Inject
  private FeedItemDAO feedItemDao;

  @Inject
  private Logger logger;
  
  @Resource
  EJBContext ejbContext;

  @Schedule(second = "0", minute = "*", hour = "*")
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateFeeds() {
    Client client = ClientBuilder.newClient();
    
    feedItemDao.deleteAll();

    List<Feed> feeds = feedDao.listAll();

    for (Feed feed : feeds) {
      
      WebTarget target = client.target(feed.getUrl());
      try (InputStream stream = target.request("*").get(InputStream.class)) {
        SyndFeedInput input = new SyndFeedInput();
        SyndFeed syndFeed = input.build(new XmlReader(stream));
        List<SyndEntry> entries = syndFeed.getEntries();
        
        for (SyndEntry entry : entries) {
          OffsetDateTime publicationDate = null;
          
          if (entry.getPublishedDate() != null) {
            // The API doesn't expose the time zone used so we need to use UTC
            // https://github.com/rometools/rome/issues/188
            publicationDate = OffsetDateTime.ofInstant(
                entry.getPublishedDate().toInstant(),
                ZoneOffset.UTC);
          }
          feedItemDao.create(
              entry.getTitle(),
              entry.getLink(),
              entry.getAuthor(),
              entry.getDescription() == null ? null : entry.getDescription().getValue(),
              publicationDate,
              (String)null,
              feed);
        }
      } catch (IOException | IllegalArgumentException | FeedException e) {
        logger.warning(String.format("Error while synchronizing feeds: %s", e.getMessage()));
        
        ejbContext.setRollbackOnly();
      }
    }
  }
}
