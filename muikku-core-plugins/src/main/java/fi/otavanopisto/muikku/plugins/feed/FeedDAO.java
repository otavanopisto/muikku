package fi.otavanopisto.muikku.plugins.feed;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;

public class FeedDAO extends CorePluginsDAO<Feed> {
  
  public Feed updateContent(Feed feed, String content) {
    feed.setContent(content);
    return persist(feed);
  }
}
