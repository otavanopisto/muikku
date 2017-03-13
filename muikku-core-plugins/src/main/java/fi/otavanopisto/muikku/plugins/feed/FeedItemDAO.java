package fi.otavanopisto.muikku.plugins.feed;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem_;

public class FeedItemDAO extends CorePluginsDAO<FeedItem> {
  private static final long serialVersionUID = 5636966026090215803L;
  
  public FeedItem create(
    String title,
    String link,
    String author,
    String description,
    OffsetDateTime publicationDate,
    String image,
    Feed feed
  ) {
    FeedItem feedItem = new FeedItem(
        title,
        link,
        author,
        description,
        publicationDate,
        image,
        feed
    );
    return persist(feedItem);
  }
	
	public List<FeedItem> findByFeed(
	    Feed feed,
	    int numItems
  ) {
	  return findByFeeds(Collections.singletonList(feed), numItems);
	}

	public List<FeedItem> findByFeeds(
	    List<Feed> feeds,
	    int numItems
  ) {
		EntityManager entityManager = getEntityManager(); 
		
		if (feeds == null || feeds.size() == 0) {
		  return Collections.emptyList();
		}
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FeedItem> criteria = criteriaBuilder.createQuery(FeedItem.class);
    Root<FeedItem> root = criteria.from(FeedItem.class);
    criteria.select(root);
    criteria.where(
        root.get(FeedItem_.feed).in(feeds)
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(FeedItem_.publicationDate)));
    
    return entityManager
        .createQuery(criteria)
        .setMaxResults(numItems)
        .getResultList();
	}
	
  public void deleteAll() {
    EntityManager entityManager = getEntityManager();
    Query query = entityManager.createQuery("delete from " + FeedItem.class.getSimpleName());
    query.executeUpdate();
  }
}
