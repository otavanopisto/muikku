package fi.otavanopisto.muikku.dao.oauth;

import java.util.List;

import fi.otavanopisto.muikku.model.oauth.ConsumerScope_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.oauth.Consumer;
import fi.otavanopisto.muikku.model.oauth.ConsumerScope;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class ConsumerScopeDAO extends CoreDAO<ConsumerScope> {

	private static final long serialVersionUID = 571348667735626184L;

	public ConsumerScope create(Consumer consumer, String scope) {
    ConsumerScope consumerScope = new ConsumerScope();
    consumerScope.setConsumer(consumer);
    consumerScope.setScope(scope);

    getEntityManager().persist(consumerScope);
    
    return consumerScope;
  }

  public ConsumerScope findByConsumerAndScope(Consumer consumer, String scope) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerScope> criteria = criteriaBuilder.createQuery(ConsumerScope.class);
    Root<ConsumerScope> root = criteria.from(ConsumerScope.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ConsumerScope_.consumer), consumer),
        criteriaBuilder.equal(root.get(ConsumerScope_.scope), scope)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<ConsumerScope> listByConsumer(Consumer consumer) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerScope> criteria = criteriaBuilder.createQuery(ConsumerScope.class);
    Root<ConsumerScope> root = criteria.from(ConsumerScope.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(ConsumerScope_.consumer), consumer));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<ConsumerScope> listByConsumerAndScopeNotIn(Consumer consumer, List<String> scopes) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerScope> criteria = criteriaBuilder.createQuery(ConsumerScope.class);
    Root<ConsumerScope> root = criteria.from(ConsumerScope.class);
    criteria.select(root);
    criteria.where(
       criteriaBuilder.and(
         criteriaBuilder.equal(root.get(ConsumerScope_.consumer), consumer),
         criteriaBuilder.not(root.get(ConsumerScope_.scope).in(scopes))
       )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(ConsumerScope consumerScope) {
    super.delete(consumerScope);
  }
}
