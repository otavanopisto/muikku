package fi.otavanopisto.muikku.dao.users;

import java.util.List;

import fi.otavanopisto.muikku.model.users.EnvironmentUser_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class EnvironmentUserDAO extends CoreDAO<EnvironmentUser> {

	private static final long serialVersionUID = 8185071427513774677L;

	public EnvironmentUser create(UserEntity user, EnvironmentRoleEntity role) {
		EnvironmentUser environmentUser = new EnvironmentUser();

		environmentUser.setUser(user);
		environmentUser.setRole(role);

		getEntityManager().persist(environmentUser);

		return environmentUser;
	}
	
	public List<EnvironmentUser> listByArchived(Boolean archived) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EnvironmentUser> criteria = criteriaBuilder.createQuery(EnvironmentUser.class);
		Root<EnvironmentUser> root = criteria.from(EnvironmentUser.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.equal(root.get(EnvironmentUser_.archived), archived));

		return entityManager.createQuery(criteria).getResultList();
	}

  public EnvironmentUser findByUserEntity(UserEntity user) {
    return findByUserAndArchived(user, Boolean.FALSE);
  }
  
	public EnvironmentUser findByUserAndArchived(UserEntity user, Boolean archived) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EnvironmentUser> criteria = criteriaBuilder.createQuery(EnvironmentUser.class);
		Root<EnvironmentUser> root = criteria.from(EnvironmentUser.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(EnvironmentUser_.user), user),
				criteriaBuilder.equal(root.get(EnvironmentUser_.archived), archived)));

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public EnvironmentUser updateRole(EnvironmentUser environmentUser, EnvironmentRoleEntity role) {
		environmentUser.setRole(role);
		return persist(environmentUser);
	}

}
