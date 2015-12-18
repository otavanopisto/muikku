package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.users.UserSchoolDataIdentifier_;

public class UserSchoolDataIdentifierDAO extends CoreDAO<UserSchoolDataIdentifier> {

	private static final long serialVersionUID = 6176973178652139440L;

	public UserSchoolDataIdentifier create(SchoolDataSource dataSource, String identifier, UserEntity userEntity, Boolean archived) {
		UserSchoolDataIdentifier userSchoolDataIdentifier = new UserSchoolDataIdentifier();

		userSchoolDataIdentifier.setIdentifier(identifier);
		userSchoolDataIdentifier.setDataSource(dataSource);
		userSchoolDataIdentifier.setUserEntity(userEntity);
		userSchoolDataIdentifier.setArchived(archived);
		
		return persist(userSchoolDataIdentifier);
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
  
  public UserSchoolDataIdentifier updateArchived(UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean archived) {
    userSchoolDataIdentifier.setArchived(archived);
    return persist(userSchoolDataIdentifier);
  }
  
}