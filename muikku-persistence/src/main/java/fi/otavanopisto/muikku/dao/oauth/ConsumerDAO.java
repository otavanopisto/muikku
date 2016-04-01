package fi.otavanopisto.muikku.dao.oauth;

import fi.otavanopisto.muikku.model.oauth.Consumer_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.oauth.Consumer;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class ConsumerDAO extends CoreDAO<Consumer> {

	private static final long serialVersionUID = -7397407913620562752L;

	public Consumer create(String consumerKey, String displayName, String connectURI) {
    Consumer consumer = new Consumer();
    consumer.setConsumerKey(consumerKey);
    consumer.setDisplayName(displayName);
    consumer.setConnectURI(connectURI);

    getEntityManager().persist(consumer);
    
    return consumer;
  }

  public Consumer findByConsumerKey(String consumerKey) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Consumer> criteria = criteriaBuilder.createQuery(Consumer.class);
    Root<Consumer> root = criteria.from(Consumer.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(Consumer_.consumerKey), consumerKey));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
