package fi.muikku.controller;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceRightsDAO;
import fi.muikku.dao.security.ResourceRolePermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.security.PermissionScope;

@Stateful
@Model
public class ResourceRightsController {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private ResourceRightsDAO resourceRightsDAO;
  

  public ResourceRights findResourceRightsById(Long id) {
    return resourceRightsDAO.findById(id);
  }
  
  public List<Permission> listResourcePermissions() {
    return permissionDAO.listByScope(PermissionScope.RESOURCE);
  }
  
  public ResourceRights create() {
    return resourceRightsDAO.create();
  }
  
  public boolean hasResourceRolePermission(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(resourceRights, role, permission);
  }
  
  // TODO: Rethink if these are needed
//  @Permit (MuikkuPermissions.MANAGE_RESOURCERIGHTS)
  public ResourceRolePermission addResourceUserRolePermission(ResourceRights resourceRights, RoleEntity role, Permission permission) {
    return resourceUserRolePermissionDAO.create(resourceRights, role, permission);
  }
  
//  @Permit (MuikkuPermissions.MANAGE_RESOURCERIGHTS)
  public void deleteResourceUserRolePermission(ResourceRolePermission rolePermission) {
    resourceUserRolePermissionDAO.delete(rolePermission);
  }

}
