package fi.otavanopisto.muikku.plugins.feed;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.feed.model.Feed;
import fi.otavanopisto.muikku.plugins.feed.model.Feed_;

public class FeedDAO extends CorePluginsDAO<Feed> {
  private static final long serialVersionUID = 5636966026090215803L;

  public Feed findByName(String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Feed> criteria = criteriaBuilder.createQuery(Feed.class);
    Root<Feed> root = criteria.from(Feed.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(Feed_.name), name));

    return getSingleResult(entityManager.createQuery(criteria));
  }
}
