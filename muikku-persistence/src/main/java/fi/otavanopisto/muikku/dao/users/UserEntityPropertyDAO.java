package fi.otavanopisto.muikku.dao.users;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntityProperty_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityProperty;

public class UserEntityPropertyDAO extends CoreDAO<UserEntityProperty> {

  private static final long serialVersionUID = -59993838809558573L;

  public UserEntityProperty create(UserEntity userEntity, String key, String value) {
    UserEntityProperty userEntityProperty = new UserEntityProperty();
    userEntityProperty.setUserEntity(userEntity);
    userEntityProperty.setKey(key);
    userEntityProperty.setValue(value);
    return persist(userEntityProperty);
  }

  public UserEntityProperty findByUserEntityAndKey(UserEntity userEntity, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEntityProperty> criteria = criteriaBuilder.createQuery(UserEntityProperty.class);
    Root<UserEntityProperty> root = criteria.from(UserEntityProperty.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEntityProperty_.userEntity), userEntity),
        criteriaBuilder.equal(root.get(UserEntityProperty_.key), key)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public UserEntityProperty updateValue(UserEntityProperty userEntityProperty, String value) {
    userEntityProperty.setValue(value);
    return persist(userEntityProperty);
  }
  
  public void delete(UserEntityProperty e) {
    super.delete(e);
  }

}