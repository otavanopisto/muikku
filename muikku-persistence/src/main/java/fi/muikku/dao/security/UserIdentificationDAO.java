package fi.muikku.dao.security;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.UserIdentification;
import fi.muikku.model.security.UserIdentification_;
import fi.muikku.model.stub.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class UserIdentificationDAO extends CoreDAO<UserIdentification> {

	private static final long serialVersionUID = -3862910101039448995L;

	public UserIdentification create(UserEntity user, String externalId, AuthSource authSource) {
    EntityManager entityManager = getEntityManager(); 
    
    UserIdentification userIdentification = new UserIdentification();
    userIdentification.setAuthSource(authSource);
    userIdentification.setExternalId(externalId);
    userIdentification.setUser(user);
    
    entityManager.persist(userIdentification);

    return userIdentification;
  }
  
  public UserIdentification findByExternalId(String externalId, AuthSource authSource) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserIdentification> criteria = criteriaBuilder.createQuery(UserIdentification.class);
    Root<UserIdentification> root = criteria.from(UserIdentification.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserIdentification_.externalId), externalId),
            criteriaBuilder.equal(root.get(UserIdentification_.authSource), authSource)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserIdentification> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserIdentification> criteria = criteriaBuilder.createQuery(UserIdentification.class);
    Root<UserIdentification> root = criteria.from(UserIdentification.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserIdentification_.user), user)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
