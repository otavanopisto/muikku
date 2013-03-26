package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.EnvironmentUserRolePermission;
import fi.muikku.model.security.EnvironmentUserRolePermission_;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.UserRole;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class EnvironmentUserRolePermissionDAO extends CoreDAO<EnvironmentUserRolePermission> {

	private static final long serialVersionUID = -6645642608906794331L;

	public EnvironmentUserRolePermission create(Environment environment, UserRole userRole, Permission permission) {
    EnvironmentUserRolePermission eurpermission = new EnvironmentUserRolePermission();
    
    eurpermission.setEnvironment(environment);
    eurpermission.setUserRole(userRole);
    eurpermission.setPermission(permission);
    
    getEntityManager().persist(eurpermission);
    
    return eurpermission;
  }
  
  public boolean hasEnvironmentPermissionAccess(Environment environment, UserRole userRole, Permission permission) {
    return findByEnvironmentUserRoleAndPermission(environment, userRole, permission) != null;
  }

  public EnvironmentUserRolePermission findByEnvironmentUserRoleAndPermission(Environment environment, UserRole userRole, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentUserRolePermission> criteria = criteriaBuilder.createQuery(EnvironmentUserRolePermission.class);
    Root<EnvironmentUserRolePermission> root = criteria.from(EnvironmentUserRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(EnvironmentUserRolePermission_.environment), environment),
            criteriaBuilder.equal(root.get(EnvironmentUserRolePermission_.userRole), userRole),
            criteriaBuilder.equal(root.get(EnvironmentUserRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(EnvironmentUserRolePermission environmentUserRolePermission) {
    super.delete(environmentUserRolePermission);
  }
}
