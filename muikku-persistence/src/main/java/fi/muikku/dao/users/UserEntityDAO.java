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
import fi.muikku.model.users.UserEntity_;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceEntity_;

public class UserEntityDAO extends CoreDAO<UserEntity> {

	private static final long serialVersionUID = 3790128454976388680L;

	public UserEntity create(Boolean archived) {
		UserEntity user = new UserEntity();

		user.setArchived(archived);

		getEntityManager().persist(user);

		return user;
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
}