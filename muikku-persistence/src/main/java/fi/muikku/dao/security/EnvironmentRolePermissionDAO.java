package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.EnvironmentRolePermission;
import fi.muikku.model.security.EnvironmentRolePermission_;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.RoleEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

@DAO
public class EnvironmentRolePermissionDAO extends CoreDAO<EnvironmentRolePermission> {

	private static final long serialVersionUID = -6645642608906794331L;

	public EnvironmentRolePermission create(RoleEntity role, Permission permission) {
		EnvironmentRolePermission eurpermission = new EnvironmentRolePermission();

		eurpermission.setRole(role);
		eurpermission.setPermission(permission);

		getEntityManager().persist(eurpermission);

		return eurpermission;
	}

	// TODO: Not a DAO method
	public boolean hasEnvironmentPermissionAccess(RoleEntity role, Permission permission) {
		return findByUserRoleAndPermission(role, permission) != null;
	}

	public EnvironmentRolePermission findByUserRoleAndPermission(RoleEntity role, Permission permission) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EnvironmentRolePermission> criteria = criteriaBuilder.createQuery(EnvironmentRolePermission.class);
		Root<EnvironmentRolePermission> root = criteria.from(EnvironmentRolePermission.class);
		criteria.select(root);
		criteria.where(criteriaBuilder.and(criteriaBuilder.equal(root.get(EnvironmentRolePermission_.role), role),
				criteriaBuilder.equal(root.get(EnvironmentRolePermission_.permission), permission)));

		return getSingleResult(entityManager.createQuery(criteria));
	}

	@Override
	public void delete(EnvironmentRolePermission environmentUserRolePermission) {
		super.delete(environmentUserRolePermission);
	}
}
