package fi.otavanopisto.muikku.dao.users;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEmailEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class UserEmailEntityDAO extends CoreDAO<UserEmailEntity> {

  private static final long serialVersionUID = -6107936582505695829L;
  
  public UserEmailEntity create(UserSchoolDataIdentifier userSchoolDataIdentifier, String address) {
    UserEmailEntity userEmail = new UserEmailEntity();
    
    userEmail.setUserSchoolDataIdentifier(userSchoolDataIdentifier);
    userEmail.setAddress(address);
    
    return persist(userEmail);
  }
  
  public UserEmailEntity findByUserSchoolDataIdentifierAndAddress(UserSchoolDataIdentifier identifier, String address) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEmailEntity_.userSchoolDataIdentifier), identifier),
        criteriaBuilder.equal(root.get(UserEmailEntity_.address), address)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<UserEmailEntity> listByUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserEmailEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserEmailEntity> listByAddresses(Collection<String> addresses) {
    if (addresses == null || addresses.isEmpty()) {
      return Collections.emptyList();
    }
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailEntity> criteria = criteriaBuilder.createQuery(UserEmailEntity.class);
    Root<UserEmailEntity> root = criteria.from(UserEmailEntity.class);
    criteria.select(root);
    criteria.where(
      root.get(UserEmailEntity_.address).in(addresses)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public void delete(UserEmailEntity userEmail) {
    super.delete(userEmail);
  }

}
