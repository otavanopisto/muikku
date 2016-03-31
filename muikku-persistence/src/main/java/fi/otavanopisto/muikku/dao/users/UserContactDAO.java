package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import fi.otavanopisto.muikku.model.users.UserContact_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserContact;
import fi.otavanopisto.muikku.model.users.UserContactType;
import fi.otavanopisto.muikku.model.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


public class UserContactDAO extends CoreDAO<UserContact> {

	private static final long serialVersionUID = 1795503440946182827L;

	public UserContact create(UserEntity user, UserContactType type, String value, Boolean hidden) {
    UserContact userContact = new UserContact();
    
    userContact.setUser(user);
    userContact.setType(type);
    userContact.setValue(value);
    userContact.setHidden(hidden);
    
    getEntityManager().persist(userContact);
    return userContact;
  }
  
  public UserContact findByUserAndType(UserEntity user, UserContactType type, Boolean hidden) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserContact> criteria = criteriaBuilder.createQuery(UserContact.class);
    Root<UserContact> root = criteria.from(UserContact.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserContact_.user), user),
            criteriaBuilder.equal(root.get(UserContact_.type), type),
            criteriaBuilder.equal(root.get(UserContact_.hidden), hidden)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserContact> listAllByUser(UserEntity user) {
    return listByUser(user, false);
  }

  public List<UserContact> listPublicByUser(UserEntity user) {
    return listByUser(user, true);
  }
  
  public List<UserContact> listByUser(UserEntity user, boolean onlyPublic) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserContact> criteria = criteriaBuilder.createQuery(UserContact.class);
    Root<UserContact> root = criteria.from(UserContact.class);
    criteria.select(root);
    
    if (onlyPublic) {
      criteria.where(
          criteriaBuilder.and(
              criteriaBuilder.equal(root.get(UserContact_.user), user),
              criteriaBuilder.equal(root.get(UserContact_.hidden), Boolean.FALSE)
          )
      );
    } else {
      criteria.where(
          criteriaBuilder.equal(root.get(UserContact_.user), user)
      );
    }
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(UserContact userContact) {
    super.delete(userContact);
  }
  
}