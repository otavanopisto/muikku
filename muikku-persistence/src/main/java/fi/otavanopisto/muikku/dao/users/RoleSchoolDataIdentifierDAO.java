package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.RoleSchoolDataIdentifier;

public class RoleSchoolDataIdentifierDAO extends CoreDAO<RoleSchoolDataIdentifier> {

	private static final long serialVersionUID = 6254699844092885890L;

	public RoleSchoolDataIdentifier create(SchoolDataSource dataSource, String identifier, RoleEntity roleEntity) {
		RoleSchoolDataIdentifier roleSchoolDataIdentifier = new RoleSchoolDataIdentifier();
		roleSchoolDataIdentifier.setDataSource(dataSource);
		roleSchoolDataIdentifier.setIdentifier(identifier);
		roleSchoolDataIdentifier.setRoleEntity(roleEntity);
		return persist(roleSchoolDataIdentifier);
	}
	
	public RoleSchoolDataIdentifier findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<RoleSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(RoleSchoolDataIdentifier.class);
		Root<RoleSchoolDataIdentifier> root = criteria.from(RoleSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.identifier), identifier)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public RoleSchoolDataIdentifier findByDataSourceAndRoleEntity(SchoolDataSource dataSource, RoleEntity roleEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<RoleSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(RoleSchoolDataIdentifier.class);
		Root<RoleSchoolDataIdentifier> root = criteria.from(RoleSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.roleEntity), roleEntity)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<RoleSchoolDataIdentifier> listByRoleEntity(RoleEntity roleEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<RoleSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(RoleSchoolDataIdentifier.class);
		Root<RoleSchoolDataIdentifier> root = criteria.from(RoleSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
      criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.roleEntity), roleEntity)
    );

		return entityManager.createQuery(criteria).getResultList();
	}

  public List<RoleSchoolDataIdentifier> listByDataSource(SchoolDataSource schoolDataSource) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<RoleSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(RoleSchoolDataIdentifier.class);
    Root<RoleSchoolDataIdentifier> root = criteria.from(RoleSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(RoleSchoolDataIdentifier_.dataSource), schoolDataSource)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

	public RoleSchoolDataIdentifier updateRoleEntity(RoleSchoolDataIdentifier roleSchoolDataIdentifier, RoleEntity roleEntity) {
		roleSchoolDataIdentifier.setRoleEntity(roleEntity);
		return persist(roleSchoolDataIdentifier);
	}
	
	@Override
	public void delete(RoleSchoolDataIdentifier roleSchoolDataIdentifier) {
		super.delete(roleSchoolDataIdentifier);
	}

}
