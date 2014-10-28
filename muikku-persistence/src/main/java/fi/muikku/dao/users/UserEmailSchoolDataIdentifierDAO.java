package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEmailEntity;
import fi.muikku.model.users.UserEmailSchoolDataIdentifier;
import fi.muikku.model.users.UserEmailSchoolDataIdentifier_;
import fi.muikku.model.users.UserEntity;

public class UserEmailSchoolDataIdentifierDAO extends CoreDAO<UserEmailSchoolDataIdentifier> {

  private static final long serialVersionUID = 7109762878521131112L;

  public UserEmailSchoolDataIdentifier create(SchoolDataSource dataSource, String identifier, UserEmailEntity userEmailEntity) {
    UserEmailSchoolDataIdentifier userEmailSchoolDataIdentifier = new UserEmailSchoolDataIdentifier();

		userEmailSchoolDataIdentifier.setIdentifier(identifier);
		userEmailSchoolDataIdentifier.setDataSource(dataSource);
		userEmailSchoolDataIdentifier.setUserEmailEntity(userEmailEntity);
		
		getEntityManager().persist(userEmailSchoolDataIdentifier);

		return userEmailSchoolDataIdentifier;
	}

	public UserEmailSchoolDataIdentifier findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserEmailSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserEmailSchoolDataIdentifier.class);
		Root<UserEmailSchoolDataIdentifier> root = criteria.from(UserEmailSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.identifier), identifier)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public UserEmailSchoolDataIdentifier findByDataSourceAndUserEntity(SchoolDataSource dataSource, UserEntity userEmailEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserEmailSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserEmailSchoolDataIdentifier.class);
		Root<UserEmailSchoolDataIdentifier> root = criteria.from(UserEmailSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.userEmailEntity), userEmailEntity)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<UserEmailSchoolDataIdentifier> listByUserEmailEntity(UserEmailEntity userEmailEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserEmailSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserEmailSchoolDataIdentifier.class);
		Root<UserEmailSchoolDataIdentifier> root = criteria.from(UserEmailSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.userEmailEntity), userEmailEntity)
	    )
    );

		return entityManager.createQuery(criteria).getResultList();
	}

  public List<UserEmailSchoolDataIdentifier> listByDataSource(SchoolDataSource dataSource) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEmailSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserEmailSchoolDataIdentifier.class);
    Root<UserEmailSchoolDataIdentifier> root = criteria.from(UserEmailSchoolDataIdentifier.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEmailSchoolDataIdentifier_.dataSource), dataSource)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}