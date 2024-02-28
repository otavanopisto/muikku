package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.base.SchoolDataSource_;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class UserSchoolDataIdentifierDAO extends CoreDAO<UserSchoolDataIdentifier> {

  private static final long serialVersionUID = 6176973178652139440L;

  public UserSchoolDataIdentifier create(SchoolDataSource dataSource, String identifier, UserEntity userEntity, 
      List<EnvironmentRoleEntity> environmentRoleEntities, OrganizationEntity organizationEntity, Boolean archived) {
    UserSchoolDataIdentifier userSchoolDataIdentifier = new UserSchoolDataIdentifier();

    userSchoolDataIdentifier.setIdentifier(identifier);
    userSchoolDataIdentifier.setDataSource(dataSource);
    userSchoolDataIdentifier.setUserEntity(userEntity);
    userSchoolDataIdentifier.setRoles(environmentRoleEntities);
    userSchoolDataIdentifier.setOrganization(organizationEntity);
    userSchoolDataIdentifier.setArchived(archived);
    
    return persist(userSchoolDataIdentifier);
  }

  public UserSchoolDataIdentifier findBySchoolDataIdentifier(SchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<UserSchoolDataIdentifier> root = criteria.from(UserSchoolDataIdentifier.class);
    Join<UserSchoolDataIdentifier, SchoolDataSource> joinSchoolDataSource = root.join(UserSchoolDataIdentifier_.dataSource);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(joinSchoolDataSource.get(SchoolDataSource_.identifier), userSchoolDataIdentifier.getDataSource()),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.identifier), userSchoolDataIdentifier.getIdentifier())
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserSchoolDataIdentifier findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<UserSchoolDataIdentifier> root = criteria.from(UserSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.identifier), identifier)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserSchoolDataIdentifier findByDataSourceAndIdentifierAndArchived(SchoolDataSource dataSource, String identifier, Boolean archived) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<UserSchoolDataIdentifier> root = criteria.from(UserSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.identifier), identifier),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<UserSchoolDataIdentifier> listByUserEntityAndArchived(UserEntity userEntity, Boolean archived) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<UserSchoolDataIdentifier> root = criteria.from(UserSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.userEntity), userEntity),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserSchoolDataIdentifier> listByDataSourceAndArchived(SchoolDataSource dataSource, Boolean archived) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<UserSchoolDataIdentifier> root = criteria.from(UserSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(UserSchoolDataIdentifier_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public UserSchoolDataIdentifier updateOrganization(UserSchoolDataIdentifier userSchoolDataIdentifier,
      OrganizationEntity organizationEntity) {
    userSchoolDataIdentifier.setOrganization(organizationEntity);
    return persist(userSchoolDataIdentifier);
  }

  public UserSchoolDataIdentifier updateRoles(UserSchoolDataIdentifier userSchoolDataIdentifier, List<EnvironmentRoleEntity> environmentRoleEntities) {
    userSchoolDataIdentifier.setRoles(environmentRoleEntities);
    return persist(userSchoolDataIdentifier);
  }

  public UserSchoolDataIdentifier updateArchived(UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean archived) {
    userSchoolDataIdentifier.setArchived(archived);
    return persist(userSchoolDataIdentifier);
  }

}