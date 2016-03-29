package fi.otavanopisto.muikku.dao.security;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.security.UserGroupRolePermission_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.UserGroupRolePermission;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;


public class UserGroupRolePermissionDAO extends CoreDAO<UserGroupRolePermission> {

  private static final long serialVersionUID = 1034213846498141630L;

  public UserGroupRolePermission create(UserGroupEntity userGroup, RoleEntity role, Permission permission) {
	  UserGroupRolePermission curpermission = new UserGroupRolePermission();
    
    curpermission.setUserGroup(userGroup);
    curpermission.setRole(role);
    curpermission.setPermission(permission);
    
    getEntityManager().persist(curpermission);
    
    return curpermission;
  }
  
	// TODO: Not a DAO method
  public boolean hasPermissionAccess(UserGroupEntity userGroup, RoleEntity role, Permission permission) {
    return findByRoleAndPermission(userGroup, role, permission) != null;
  }

  public UserGroupRolePermission findByRoleAndPermission(UserGroupEntity userGroup, RoleEntity role, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupRolePermission> criteria = criteriaBuilder.createQuery(UserGroupRolePermission.class);
    Root<UserGroupRolePermission> root = criteria.from(UserGroupRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupRolePermission_.userGroup), userGroup),
            criteriaBuilder.equal(root.get(UserGroupRolePermission_.role), role),
            criteriaBuilder.equal(root.get(UserGroupRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(UserGroupRolePermission userGroupRolePermission) {
    super.delete(userGroupRolePermission);
  }
  
}
