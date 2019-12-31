package fi.otavanopisto.muikku.plugins.feed;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.EJBContext;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.RedirectionException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import org.apache.commons.io.IOUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

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
  
  private String clean(String html) {
    Document doc = Jsoup.parse(html);
    doc = new Cleaner(Whitelist.basic()).clean(doc);
    doc.select("a[target]").attr("rel", "noopener noreferer");
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

  @Schedule(second = "0", minute = "0", hour = "*", persistent = false)
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void updateFeeds() {
    Client client = ClientBuilder.newClient();
    
    feedItemDao.deleteAll();

    List<Feed> feeds = feedDao.listAll();

    for (Feed feed : feeds) {
      
      WebTarget target = client.target(feed.getUrl());
      Reader reader = null;
      try {
        InputStream stream = target.request("*").get(InputStream.class);
        reader = new XmlReader(stream);
        SyndFeedInput input = new SyndFeedInput();
        SyndFeed syndFeed = input.build(reader);
        List<SyndEntry> entries = syndFeed.getEntries();
        
        for (SyndEntry entry : entries) {
          feedItemDao.create(
              entry.getTitle(),
              entry.getLink(),
              entry.getAuthor(),
              entry.getDescription() == null
                  ? null
                  : clean(entry.getDescription().getValue()),
              entry.getPublishedDate(),
              (String)null,
              feed);
        }
      }
      catch (IOException | IllegalArgumentException | FeedException | RedirectionException e) {
        logger.warning(String.format("Error while synchronizing feeds: %s", e.getMessage()));
        
        ejbContext.setRollbackOnly();
      }
      finally {
        IOUtils.closeQuietly(reader);
      }
    }
  }
}
