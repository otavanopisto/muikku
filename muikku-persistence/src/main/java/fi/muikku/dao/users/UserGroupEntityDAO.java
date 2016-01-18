package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserGroupEntity_;
import fi.muikku.model.users.UserGroupUserEntity;
import fi.muikku.model.users.UserGroupUserEntity_;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.users.UserSchoolDataIdentifier_;

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
  
  public UserGroupEntity findByDataSourceAndIdentifierAndArchived(SchoolDataSource schoolDataSource, String identifier, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupEntity> root = criteria.from(UserGroupEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(          
        criteriaBuilder.equal(root.get(UserGroupEntity_.archived), archived),
        criteriaBuilder.equal(root.get(UserGroupEntity_.schoolDataSource), schoolDataSource),
        criteriaBuilder.equal(root.get(UserGroupEntity_.identifier), identifier)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserGroupEntity updateArchived(UserGroupEntity userGroupEntity, Boolean archived) {
    userGroupEntity.setArchived(archived);
    return persist(userGroupEntity);
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

  public List<UserGroupEntity> listByArchived(Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupEntity> root = criteria.from(UserGroupEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserGroupEntity_.archived), archived)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserGroupEntity> listByUserIdentifierExcludeArchived(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserGroupEntity> groupJoin = root.join(UserGroupUserEntity_.userGroupEntity);
    criteria.select(root.get(UserGroupUserEntity_.userGroupEntity));

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(groupJoin.get(UserGroupEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), Boolean.FALSE)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserGroupEntity> listByUserEntityExcludeArchived(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupEntity> criteria = criteriaBuilder.createQuery(UserGroupEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserSchoolDataIdentifier> join = root.join(UserGroupUserEntity_.userSchoolDataIdentifier);
    Join<UserGroupUserEntity, UserGroupEntity> join2 = root.join(UserGroupUserEntity_.userGroupEntity);
    
    criteria.select(root.get(UserGroupUserEntity_.userGroupEntity));

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(join.get(UserSchoolDataIdentifier_.userEntity), userEntity),
        criteriaBuilder.equal(join.get(UserSchoolDataIdentifier_.archived), Boolean.FALSE),
        criteriaBuilder.equal(join2.get(UserGroupEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), Boolean.FALSE)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public Long countGroupUsers(UserGroupEntity userGroupEntity) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.userGroupEntity), userGroupEntity),
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), Boolean.FALSE)
        )
    );
   
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public void delete(UserGroupEntity userGroupEntity){
    super.delete(userGroupEntity);
  }
  
}