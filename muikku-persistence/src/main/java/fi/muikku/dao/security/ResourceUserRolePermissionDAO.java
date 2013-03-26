package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceUserRolePermission;
import fi.muikku.model.security.ResourceUserRolePermission_;
import fi.muikku.model.users.UserRole;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class ResourceUserRolePermissionDAO extends CoreDAO<ResourceUserRolePermission> {

	private static final long serialVersionUID = 4464296827090661759L;

	public ResourceUserRolePermission create(ResourceRights resourceRights, UserRole userRole, Permission permission) {
    ResourceUserRolePermission rurpermission = new ResourceUserRolePermission();
    
    rurpermission.setResourcePermission(resourceRights);
    rurpermission.setUserRole(userRole);
    rurpermission.setPermission(permission);
    
    getEntityManager().persist(rurpermission);
    
    return rurpermission;
  }
  
  public boolean hasResourcePermissionAccess(ResourceRights resourceRights, UserRole userRole, Permission permission) {
    return findByUserRoleAndPermission(resourceRights, userRole, permission) != null;
  }

  public ResourceUserRolePermission findByUserRoleAndPermission(ResourceRights resourceRights, UserRole userRole, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ResourceUserRolePermission> criteria = criteriaBuilder.createQuery(ResourceUserRolePermission.class);
    Root<ResourceUserRolePermission> root = criteria.from(ResourceUserRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ResourceUserRolePermission_.resourcePermission), resourceRights),
            criteriaBuilder.equal(root.get(ResourceUserRolePermission_.userRole), userRole),
            criteriaBuilder.equal(root.get(ResourceUserRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(ResourceUserRolePermission userRolePermission) {
    super.delete(userRolePermission);
  }
  
}
