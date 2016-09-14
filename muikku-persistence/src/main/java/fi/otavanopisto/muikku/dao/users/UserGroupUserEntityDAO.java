package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class UserGroupUserEntityDAO extends CoreDAO<UserGroupUserEntity> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroupUserEntity create(UserGroupEntity userGroupEntity,
                                SchoolDataSource schoolDataSource,
                                String identifier,
                                UserSchoolDataIdentifier userSchoolDataIdentifier,
                                boolean archived
  ) {
    UserGroupUserEntity userGroupUser = new UserGroupUserEntity();

    userGroupUser.setArchived(archived);
    userGroupUser.setSchoolDataSource(schoolDataSource);
    userGroupUser.setIdentifier(identifier);
    userGroupUser.setUserGroupEntity(userGroupEntity);
    userGroupUser.setUserSchoolDataIdentifier(userSchoolDataIdentifier);

    getEntityManager().persist(userGroupUser);

    return userGroupUser;
  }
  
  public UserGroupUserEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.schoolDataSource), schoolDataSource),
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.identifier), identifier)
        )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public UserGroupUserEntity findByDataSourceAndIdentifierAndArchived(SchoolDataSource schoolDataSource, String identifier, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.schoolDataSource), schoolDataSource),
            criteriaBuilder.equal(root.get(UserGroupUserEntity_.identifier), identifier)
        )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserGroupUserEntity> listByUserGroupEntityAndArchived(UserGroupEntity userGroupEntity, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.userGroupEntity), userGroupEntity),
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), archived)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserGroupUserEntity> listByUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserGroupUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public UserGroupUserEntity updateArchived(UserGroupUserEntity userGroupUserEntity, Boolean archived) {
    userGroupUserEntity.setArchived(archived);
    return persist(userGroupUserEntity);
  }

  public UserGroupUserEntity updateUserSchoolDataIdentifier(UserGroupUserEntity userGroupUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    userGroupUserEntity.setUserSchoolDataIdentifier(userSchoolDataIdentifier);
    return persist(userGroupUserEntity);
  }

  public void delete(UserGroupUserEntity userGroupUserEntity) {
    super.delete(userGroupUserEntity);
  }
  
}