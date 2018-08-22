package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity_;

public class OrganizationEntityDAO extends CoreDAO<OrganizationEntity> {

  private static final long serialVersionUID = 9086977548291745296L;

  public OrganizationEntity create(SchoolDataSource dataSource, String identifier, String name) {
    OrganizationEntity roleSchoolDataIdentifier = new OrganizationEntity();
    roleSchoolDataIdentifier.setDataSource(dataSource);
    roleSchoolDataIdentifier.setIdentifier(identifier);
    roleSchoolDataIdentifier.setName(name);
    return persist(roleSchoolDataIdentifier);
  }
  
  public List<OrganizationEntity> listUnarchived() {
    // TODO: Archived?
    return listAll();
  }
  
  public OrganizationEntity findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<OrganizationEntity> criteria = criteriaBuilder.createQuery(OrganizationEntity.class);
    Root<OrganizationEntity> root = criteria.from(OrganizationEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(OrganizationEntity_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(OrganizationEntity_.identifier), identifier)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<OrganizationEntity> listByDataSource(SchoolDataSource schoolDataSource) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<OrganizationEntity> criteria = criteriaBuilder.createQuery(OrganizationEntity.class);
    Root<OrganizationEntity> root = criteria.from(OrganizationEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(OrganizationEntity_.dataSource), schoolDataSource)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public OrganizationEntity updateRoleEntity(OrganizationEntity organizationEntity, String name) {
    organizationEntity.setName(name);
    return persist(organizationEntity);
  }
  
  @Override
  public void delete(OrganizationEntity organizationEntity) {
    super.delete(organizationEntity);
  }

}
