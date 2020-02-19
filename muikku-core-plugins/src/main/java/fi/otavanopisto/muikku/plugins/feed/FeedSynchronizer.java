package fi.otavanopisto.muikku.plugins.feed;

import java.io.InputStream;
import java.io.Reader;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem;

@Singleton
public class FeedSynchronizer {

  @Inject
  private FeedDAO feedDAO;

  @Inject
  private FeedItemDAO feedItemDAO;

  @Inject
  private Logger logger;
  
  private String clean(String html) {
    Document doc = Jsoup.parse(html);
    doc = new Cleaner(Whitelist.basicWithImages()).clean(doc);
    doc.select("a[target]").attr("rel", "noopener noreferer");
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

  @Schedule(second = "0", minute = "0", hour = "*", persistent = false)
  public void updateFeeds() {
    Client client = ClientBuilder.newClient();
    List<Feed> feeds = feedDAO.listAll();
    for (Feed feed : feeds) {
      WebTarget target = client.target(feed.getUrl());
      Reader reader = null;
      try {
        
        // Read feed
        
        InputStream stream = target.request("*").get(InputStream.class);
        reader = new XmlReader(stream);
        SyndFeedInput input = new SyndFeedInput();
        SyndFeed syndFeed = input.build(reader);
        List<SyndEntry> entries = syndFeed.getEntries();
        
        // List old entries
        
        List<FeedItem> feedItems = feedItemDAO.listByFeed(feed);

        // Create/update entries from feed
        
        for (SyndEntry entry : entries) {
          FeedItem existingItem = feedItems.stream().filter(feedItem -> StringUtils.equals(feedItem.getLink(), entry.getLink())).findFirst().orElse(null);
          if (existingItem == null) {
            feedItemDAO.create(
                entry.getTitle(),
                entry.getLink(),
                entry.getAuthor(),
                entry.getDescription() == null ? null : clean(entry.getDescription().getValue()),
                entry.getPublishedDate(),
                null, // TODO thumbnail image
                feed);
          }
          else {
            feedItemDAO.update(
                existingItem,
                entry.getTitle(),
                entry.getLink(),
                entry.getAuthor(),
                entry.getDescription() == null ? null : clean(entry.getDescription().getValue()),
                entry.getPublishedDate(),
                null);  // TODO thumbnail image
            feedItems.remove(existingItem);
          }
        }
        
        // Remove deprecated entries

        for (FeedItem feedItem : feedItems) {
          feedItemDAO.delete(feedItem);
        }
      }
      catch (Exception e) {
        logger.warning(String.format("Error synchronizing feed %ss: %s", feed.getName(), e.getMessage()));
      }
      finally {
        IOUtils.closeQuietly(reader);
      }
    }
  }

}