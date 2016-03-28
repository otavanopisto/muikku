package fi.otavanopisto.muikku.dao.security;

import java.util.List;

import fi.otavanopisto.muikku.model.security.EnvironmentGroupPermission_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.EnvironmentGroupPermission;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class EnvironmentGroupPermissionDAO extends CoreDAO<EnvironmentGroupPermission> {

	private static final long serialVersionUID = -6565706086972870423L;

  public EnvironmentGroupPermission create(UserGroupEntity group, Permission permission) {
	  EnvironmentGroupPermission eurpermission = new EnvironmentGroupPermission();

		eurpermission.setUserGroup(group);
		eurpermission.setPermission(permission);

		getEntityManager().persist(eurpermission);

		return eurpermission;
	}

	// TODO: Not a DAO method
	public boolean hasEnvironmentPermissionAccess(UserGroupEntity group, Permission permission) {
		return findByGroupAndPermission(group, permission) != null;
	}

	public EnvironmentGroupPermission findByGroupAndPermission(UserGroupEntity userGroup, Permission permission) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EnvironmentGroupPermission> criteria = criteriaBuilder.createQuery(EnvironmentGroupPermission.class);
		Root<EnvironmentGroupPermission> root = criteria.from(EnvironmentGroupPermission.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(EnvironmentGroupPermission_.userGroup), userGroup),
				criteriaBuilder.equal(root.get(EnvironmentGroupPermission_.permission), permission)));

		return getSingleResult(entityManager.createQuery(criteria));
	}

  public List<EnvironmentGroupPermission> listByPermission(Permission permission) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentGroupPermission> criteria = criteriaBuilder.createQuery(EnvironmentGroupPermission.class);
    Root<EnvironmentGroupPermission> root = criteria.from(EnvironmentGroupPermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(EnvironmentGroupPermission_.permission), permission)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

	@Override
	public void delete(EnvironmentGroupPermission environmentUserRolePermission) {
		super.delete(environmentUserRolePermission);
	}
}
