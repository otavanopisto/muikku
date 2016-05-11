package fi.otavanopisto.muikku.dao.security;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.security.RolePermission_;
import fi.otavanopisto.muikku.model.users.RoleEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class RolePermissionDAO extends CoreDAO<RolePermission> {

  private static final long serialVersionUID = -5450007023015652417L;

  public RolePermission findByUserRoleAndPermission(RoleEntity role, Permission permission) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<RolePermission> criteria = criteriaBuilder.createQuery(RolePermission.class);
		Root<RolePermission> root = criteria.from(RolePermission.class);
		criteria.select(root);
		criteria.where(
		  criteriaBuilder.and(
		    criteriaBuilder.equal(root.get(RolePermission_.role), role),
				criteriaBuilder.equal(root.get(RolePermission_.permission), permission)
		  )
		);

		return getSingleResult(entityManager.createQuery(criteria));
	}

}
