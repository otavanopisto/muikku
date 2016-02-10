package fi.muikku.dao.users;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserEntity;

public class UserEntityDAO extends CoreDAO<UserEntity> {

	private static final long serialVersionUID = 3790128454976388680L;

	public UserEntity create(Boolean archived, SchoolDataSource defaultSchoolDataSource, String defaultIdentifier, String locale) {
		UserEntity userEntity = new UserEntity();

		userEntity.setArchived(archived);
		userEntity.setDefaultIdentifier(defaultIdentifier);
		userEntity.setDefaultSchoolDataSource(defaultSchoolDataSource);
		userEntity.setLocale(locale);
		
		return persist(userEntity);
	}

	public List<UserEntity> listByUserNotIn(List<UserEntity> users) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserEntity> criteria = criteriaBuilder.createQuery(UserEntity.class);
		Root<UserEntity> root = criteria.from(UserEntity.class);
		criteria.select(root);

		if (!users.isEmpty()) {
			criteria.where(criteriaBuilder.not(root.in(users)));
		}

		return entityManager.createQuery(criteria).getResultList();
	}

	public UserEntity updateLastLogin(UserEntity userEntity) {
	  userEntity.setLastLogin(new Date());
	  
	  getEntityManager().persist(userEntity);
	  
	  return userEntity; 
	}

  public UserEntity updateDefaultIdentifier(UserEntity userEntity, String defaultIdentifier) {
    userEntity.setDefaultIdentifier(defaultIdentifier);
    return persist(userEntity);
  }

  public UserEntity updateLocale(UserEntity userEntity, String locale) {
    userEntity.setLocale(locale);
    return persist(userEntity);
  }

  public UserEntity updateDefaultSchoolDataSource(UserEntity userEntity, SchoolDataSource defaultSchoolDataSource) {
    userEntity.setDefaultSchoolDataSource(defaultSchoolDataSource);
    return persist(userEntity);
  }

  public UserEntity updateArchived(UserEntity userEntity, Boolean archived) {
    userEntity.setArchived(archived);
    return persist(userEntity);
  }
}