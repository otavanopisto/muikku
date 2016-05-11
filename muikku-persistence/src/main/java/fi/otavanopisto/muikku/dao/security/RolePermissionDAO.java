package fi.otavanopisto.muikku.dao.security;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.security.RolePermission_;
import fi.otavanopisto.muikku.model.users.RoleEntity;

public class RolePermissionDAO extends CoreDAO<RolePermission> {

  private static final long serialVersionUID = -5450007023015652417L;
  
  public RolePermission create(RoleEntity role, Permission permission) {
    RolePermission rolePermission = new RolePermission();

    rolePermission.setRole(role);
    rolePermission.setPermission(permission);

    getEntityManager().persist(rolePermission);

    return rolePermission;
  }

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

  public List<RolePermission> listByPermission(Permission permission) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<RolePermission> criteria = criteriaBuilder.createQuery(RolePermission.class);
    Root<RolePermission> root = criteria.from(RolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(RolePermission_.permission), permission)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(RolePermission rolePermission) {
    super.delete(rolePermission);
  }

}
