package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty;
import fi.otavanopisto.muikku.model.users.UserIdentifierProperty_;

public class UserIdentifierPropertyDAO extends CoreDAO<UserIdentifierProperty> {

  private static final long serialVersionUID = 2409787580365776203L;

  public UserIdentifierProperty create(String identifier, String key, String value) {
    UserIdentifierProperty userIdentifierProperty = new UserIdentifierProperty();
    userIdentifierProperty.setIdentifier(identifier);
    userIdentifierProperty.setKey(key);
    userIdentifierProperty.setValue(value);
    return persist(userIdentifierProperty);
  }

  public UserIdentifierProperty findByIdentifierAndKey(String identifier, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserIdentifierProperty> criteria = criteriaBuilder.createQuery(UserIdentifierProperty.class);
    Root<UserIdentifierProperty> root = criteria.from(UserIdentifierProperty.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserIdentifierProperty_.identifier), identifier),
        criteriaBuilder.equal(root.get(UserIdentifierProperty_.key), key)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserIdentifierProperty> listByIdentifier(String identifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserIdentifierProperty> criteria = criteriaBuilder.createQuery(UserIdentifierProperty.class);
    Root<UserIdentifierProperty> root = criteria.from(UserIdentifierProperty.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(UserIdentifierProperty_.identifier), identifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public UserIdentifierProperty updateValue(UserIdentifierProperty userIdentifierProperty, String value) {
    userIdentifierProperty.setValue(value);
    return persist(userIdentifierProperty);
  }
  
  public void delete(UserIdentifierProperty e) {
    super.delete(e);
  }

}