package fi.otavanopisto.muikku.dao.users;

import java.util.EnumSet;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.dao.Predicates;
import fi.otavanopisto.muikku.model.base.Archived;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.base.SchoolDataSource_;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity_;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

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

  public UserGroupUserEntity findByGroupAndUser(UserGroupEntity userGroupEntity, SchoolDataIdentifier userIdentifier, Archived archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserSchoolDataIdentifier> userSchoolDataIdentifier = root.join(UserGroupUserEntity_.userSchoolDataIdentifier);
    Join<UserSchoolDataIdentifier, SchoolDataSource> schoolDataSource = userSchoolDataIdentifier.join(UserSchoolDataIdentifier_.dataSource);
    
    Predicates predicates = Predicates.newInstance()
        .add(criteriaBuilder.equal(root.get(UserGroupUserEntity_.userGroupEntity), userGroupEntity))
        .add(criteriaBuilder.equal(schoolDataSource.get(SchoolDataSource_.identifier), userIdentifier.getDataSource()))
        .add(criteriaBuilder.equal(userSchoolDataIdentifier.get(UserSchoolDataIdentifier_.identifier), userIdentifier.getIdentifier()));
    
    if (archived.isBoolean()) {
      predicates.add(criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), archived.booleanValue()));
    }
    
    criteria
      .select(root)
      .where(criteriaBuilder.and(predicates.array()));
   
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

  public List<UserGroupUserEntity> listUserGroupStaffMembers(UserGroupEntity userGroupEntity, Archived archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUserEntity> criteria = criteriaBuilder.createQuery(UserGroupUserEntity.class);
    Root<UserGroupUserEntity> root = criteria.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserSchoolDataIdentifier> userSchoolDataIdentifier = root.join(UserGroupUserEntity_.userSchoolDataIdentifier);
    ListJoin<UserSchoolDataIdentifier, EnvironmentRoleEntity> environmentRole = userSchoolDataIdentifier.join(UserSchoolDataIdentifier_.roles);

    EnumSet<EnvironmentRoleArchetype> staffMemberRoles = EnumSet.of(
        EnvironmentRoleArchetype.ADMINISTRATOR,
        EnvironmentRoleArchetype.MANAGER,
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER,
        EnvironmentRoleArchetype.TEACHER
    ); 
    
    Predicates predicates = Predicates.newInstance()
        .add(criteriaBuilder.equal(root.get(UserGroupUserEntity_.userGroupEntity), userGroupEntity))
        .add(environmentRole.get(EnvironmentRoleEntity_.archetype).in(staffMemberRoles));
    
    if (archived.isBoolean()) {
      predicates.add(criteriaBuilder.equal(root.get(UserGroupUserEntity_.archived), archived.booleanValue()));
    }
    
    criteria
      .select(root)
      .distinct(true)
      .where(criteriaBuilder.and(predicates.array()));
   
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

  public UserGroupUserEntity updateUserGroupEntity(UserGroupUserEntity userGroupUserEntity, UserGroupEntity userGroupEntity) {
    userGroupUserEntity.setUserGroupEntity(userGroupEntity);
    return persist(userGroupUserEntity);
  }

  public void delete(UserGroupUserEntity userGroupUserEntity) {
    super.delete(userGroupUserEntity);
  }

  public boolean haveSharedUserGroups(UserEntity user1, UserEntity user2) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserGroupEntity> root = criteria.from(UserGroupEntity.class);
    
    Subquery<UserGroupEntity> user1Groups = criteria.subquery(UserGroupEntity.class);
    Subquery<UserGroupEntity> user2Groups = criteria.subquery(UserGroupEntity.class);
    
    Root<UserGroupUserEntity> user1Root = user1Groups.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserSchoolDataIdentifier> user1Identifier = user1Root.join(UserGroupUserEntity_.userSchoolDataIdentifier);
    Root<UserGroupUserEntity> user2Root = user2Groups.from(UserGroupUserEntity.class);
    Join<UserGroupUserEntity, UserSchoolDataIdentifier> user2Identifier = user2Root.join(UserGroupUserEntity_.userSchoolDataIdentifier);
    
    user1Groups.select(user1Root.get(UserGroupUserEntity_.userGroupEntity));
    user2Groups.select(user2Root.get(UserGroupUserEntity_.userGroupEntity));
    
    user1Groups.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(user1Identifier.get(UserSchoolDataIdentifier_.userEntity), user1),
            criteriaBuilder.equal(user1Root.get(UserGroupUserEntity_.archived), Boolean.FALSE)
        )
    );
    user2Groups.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(user2Identifier.get(UserSchoolDataIdentifier_.userEntity), user2),
            criteriaBuilder.equal(user2Root.get(UserGroupUserEntity_.archived), Boolean.FALSE)
        )
    );
    
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            root.in(user1Groups),
            root.in(user2Groups),
            criteriaBuilder.equal(root.get(UserGroupEntity_.archived), Boolean.FALSE)
        )
    );
   
    return entityManager.createQuery(criteria).getSingleResult() > 0;
  }
  
}