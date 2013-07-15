package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceRolePermission;
import fi.muikku.model.security.ResourceRolePermission_;
import fi.muikku.model.users.RoleEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class ResourceRolePermissionDAO extends CoreDAO<ResourceRolePermission> {

	private static final long serialVersionUID = 4464296827090661759L;

	public ResourceRolePermission create(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    ResourceRolePermission rurpermission = new ResourceRolePermission();
    
    rurpermission.setResourcePermission(resourceRights);
    rurpermission.setRole(role);
    rurpermission.setPermission(permission);
    
    getEntityManager().persist(rurpermission);
    
    return rurpermission;
  }
  
	// TODO: Not a DAO method
  public boolean hasResourcePermissionAccess(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    return findByUserRoleAndPermission(resourceRights, role, permission) != null;
  }

  public ResourceRolePermission findByUserRoleAndPermission(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ResourceRolePermission> criteria = criteriaBuilder.createQuery(ResourceRolePermission.class);
    Root<ResourceRolePermission> root = criteria.from(ResourceRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ResourceRolePermission_.resourcePermission), resourceRights),
            criteriaBuilder.equal(root.get(ResourceRolePermission_.role), role),
            criteriaBuilder.equal(root.get(ResourceRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(ResourceRolePermission userRolePermission) {
    super.delete(userRolePermission);
  }
  
}
