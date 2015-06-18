package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupEntity_;

public class UserGroupEntityDAO extends CoreDAO<UserGroupEntity> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroupEntity create(SchoolDataSource defaultSchoolDataSource, String defaultIdentifier, boolean archived) {
    UserGroupEntity userGroup = new UserGroupEntity();
    
    userGroup.setArchived(archived);
    userGroup.setSchoolDataSource(defaultSchoolDataSource);
    userGroup.setIdentifier(defaultIdentifier);

    getEntityManager().persist(userGroup);

    return userGroup;
  }

  public UserGroupEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupEntity> root = criteria.from(UserGroupEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(          
        criteriaBuilder.equal(root.get(UserGroupEntity_.schoolDataSource), schoolDataSource),
        criteriaBuilder.equal(root.get(UserGroupEntity_.identifier), identifier)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserGroupEntity archive(UserGroupEntity userGroupEntity) {
    userGroupEntity.setArchived(true);
    
    getEntityManager().persist(userGroupEntity);
    
    return userGroupEntity;
  }

  public List<UserGroupEntity> listByDataSource(SchoolDataSource schoolDataSource, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupEntity> root = criteria.from(UserGroupEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserGroupEntity_.schoolDataSource), schoolDataSource)
    );
   
    TypedQuery<UserGroupEntity> query = entityManager.createQuery(criteria);
    
    if (firstResult != null) {
      query.setFirstResult(firstResult);
    }
    
    if (maxResults != null) {
      query.setMaxResults(maxResults);
    }
    
    return query.getResultList();
  }

}