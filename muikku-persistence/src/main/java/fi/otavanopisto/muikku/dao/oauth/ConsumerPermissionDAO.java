package fi.otavanopisto.muikku.dao.oauth;

import java.util.List;

import fi.otavanopisto.muikku.model.oauth.ConsumerPermission_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.oauth.Consumer;
import fi.otavanopisto.muikku.model.oauth.ConsumerPermission;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class ConsumerPermissionDAO extends CoreDAO<ConsumerPermission> {

	private static final long serialVersionUID = 2260087590243069907L;

	public ConsumerPermission create(Consumer consumer, String permission) {
    ConsumerPermission consumerPermission = new ConsumerPermission();
    consumerPermission.setConsumer(consumer);
    consumerPermission.setPermission(permission);

    getEntityManager().persist(consumerPermission);
    
    return consumerPermission;
  }

  public ConsumerPermission findByConsumerAndPermission(Consumer consumer, String permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerPermission> criteria = criteriaBuilder.createQuery(ConsumerPermission.class);
    Root<ConsumerPermission> root = criteria.from(ConsumerPermission.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ConsumerPermission_.consumer), consumer),
        criteriaBuilder.equal(root.get(ConsumerPermission_.permission), permission)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<ConsumerPermission> listByConsumer(Consumer consumer) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerPermission> criteria = criteriaBuilder.createQuery(ConsumerPermission.class);
    Root<ConsumerPermission> root = criteria.from(ConsumerPermission.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(ConsumerPermission_.consumer), consumer));
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<ConsumerPermission> listByConsumerAndPermissionNotIn(Consumer consumer, List<String> permissions) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ConsumerPermission> criteria = criteriaBuilder.createQuery(ConsumerPermission.class);
    Root<ConsumerPermission> root = criteria.from(ConsumerPermission.class);
    criteria.select(root);
    criteria.where(
       criteriaBuilder.and(
         criteriaBuilder.equal(root.get(ConsumerPermission_.consumer), consumer),
         criteriaBuilder.not(root.get(ConsumerPermission_.permission).in(permissions))
       )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(ConsumerPermission consumerScope) {
    super.delete(consumerScope);
  }
}
