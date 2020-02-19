package fi.otavanopisto.muikku.plugins.feed;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem;
import fi.otavanopisto.muikku.plugins.feed.model.FeedItem_;

public class FeedItemDAO extends CorePluginsDAO<FeedItem> {
  private static final long serialVersionUID = 5636966026090215803L;
  
  public FeedItem create(String title, String link, String author, String description, Date publicationDate, String image, Feed feed) {
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
  
  public FeedItem update(FeedItem feedItem, String title, String link, String author, String description, Date publicationDate, String image) {
    EntityManager entityManager = getEntityManager();
    
    feedItem.setTitle(title);
    feedItem.setLink(link);
    feedItem.setAuthor(author);
    feedItem.setDescription(description);
    feedItem.setPublicationDate(publicationDate);
    feedItem.setImage(image);
    
    entityManager.persist(feedItem);
    return feedItem;
  }
  
  public List<FeedItem> listByFeed(Feed feed) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FeedItem> criteria = criteriaBuilder.createQuery(FeedItem.class);
    Root<FeedItem> root = criteria.from(FeedItem.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FeedItem_.feed), feed)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
	
	public List<FeedItem> findByFeed(Feed feed, int numItems) {
	  return findByFeeds(Collections.singletonList(feed), numItems, FeedSortOrder.DESCENDING);
	}

  public List<FeedItem> findByFeeds(List<Feed> feeds, int numItems, FeedSortOrder order) {
    EntityManager entityManager = getEntityManager();

    if (feeds == null || feeds.size() == 0) {
      return Collections.emptyList();
    }

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FeedItem> criteria = criteriaBuilder.createQuery(FeedItem.class);
    Root<FeedItem> root = criteria.from(FeedItem.class);
    criteria.select(root);
    criteria.where(root.get(FeedItem_.feed).in(feeds));
    switch (order) {
    case ASCENDING:
      criteria.orderBy(criteriaBuilder.asc(root.get(FeedItem_.publicationDate)));
      break;
    case DESCENDING:
      criteria.orderBy(criteriaBuilder.desc(root.get(FeedItem_.publicationDate)));
      break;
    }

    return entityManager.createQuery(criteria).setMaxResults(numItems).getResultList();
	}

  @Override
  public void delete(FeedItem feedItem) {
    super.delete(feedItem);
  }

}
