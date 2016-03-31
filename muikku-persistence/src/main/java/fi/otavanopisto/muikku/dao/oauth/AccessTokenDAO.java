package fi.otavanopisto.muikku.dao.oauth;

import fi.otavanopisto.muikku.model.oauth.AccessToken_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.oauth.AccessToken;
import fi.otavanopisto.muikku.model.oauth.Consumer;
import fi.otavanopisto.muikku.model.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class AccessTokenDAO extends CoreDAO<AccessToken> {

  private static final long serialVersionUID = 1639492062009435414L;

  public AccessToken create(Consumer consumer, UserEntity user, String token, String secret, Long timestamp, Long timeToLive) {
    AccessToken accessToken = new AccessToken();

    accessToken.setUser(user);
    accessToken.setConsumer(consumer);
    accessToken.setSecret(secret);
    accessToken.setTimestamp(timestamp);
    accessToken.setTimeToLive(timeToLive);
    accessToken.setToken(token);

    getEntityManager().persist(accessToken);

    return accessToken;
  }

  public AccessToken findByConsumerAndToken(Consumer consumer, String token) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AccessToken> criteria = criteriaBuilder.createQuery(AccessToken.class);
    Root<AccessToken> root = criteria.from(AccessToken.class);
    criteria.select(root);

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AccessToken_.token), token),
        criteriaBuilder.equal(root.get(AccessToken_.consumer), consumer)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(AccessToken consumerScope) {
    super.delete(consumerScope);
  }
}
