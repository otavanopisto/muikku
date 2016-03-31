package fi.otavanopisto.muikku.dao.oauth;

import fi.otavanopisto.muikku.model.oauth.RequestToken_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.oauth.Consumer;
import fi.otavanopisto.muikku.model.oauth.RequestToken;
import fi.otavanopisto.muikku.model.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class RequestTokenDAO extends CoreDAO<RequestToken> {

	private static final long serialVersionUID = -2769069521509805339L;

	public RequestToken create(Consumer consumer, String token, String secret, Long timestamp, Long timeToLive, String callback, String verifier, UserEntity user) {
    RequestToken requestToken = new RequestToken();
    
    requestToken.setCallback(callback);
    requestToken.setConsumer(consumer);
    requestToken.setSecret(secret);
    requestToken.setTimestamp(timestamp);
    requestToken.setTimeToLive(timeToLive);
    requestToken.setToken(token);
    requestToken.setVerifier(verifier);
    requestToken.setUser(user);
    
    getEntityManager().persist(requestToken);
    
    return requestToken;
  }

  public RequestToken findByToken(String token) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<RequestToken> criteria = criteriaBuilder.createQuery(RequestToken.class);
    Root<RequestToken> root = criteria.from(RequestToken.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(RequestToken_.token), token)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public RequestToken findByConsumerAndToken(Consumer consumer, String token) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<RequestToken> criteria = criteriaBuilder.createQuery(RequestToken.class);
    Root<RequestToken> root = criteria.from(RequestToken.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(RequestToken_.token), token),
        criteriaBuilder.equal(root.get(RequestToken_.consumer), consumer)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public RequestToken updateVerifier(RequestToken requestToken, String verifier) {
    requestToken.setVerifier(verifier);
    getEntityManager().persist(requestToken);
    return requestToken;
  }

  public RequestToken updateUser(RequestToken requestToken, UserEntity user) {
    requestToken.setUser(user);
    getEntityManager().persist(requestToken);
    return requestToken;
  }
  
  public void delete(RequestToken requestToken) {
    super.delete(requestToken);
  }

}
