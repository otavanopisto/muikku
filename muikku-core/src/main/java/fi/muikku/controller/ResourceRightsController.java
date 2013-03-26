package fi.muikku.controller;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceRightsDAO;
import fi.muikku.dao.security.ResourceUserRolePermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.security.ResourceUserRolePermission;
import fi.muikku.model.users.UserRole;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Permit;

@Stateful
@Model
@Named ("resourceRights")
public class ResourceRightsController {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceUserRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private ResourceRightsDAO resourceRightsDAO;
  

  public ResourceRights getResourceRightsById(Long id) {
    return resourceRightsDAO.findById(id);
  }
  
  public List<Permission> listResourcePermissions() {
    return permissionDAO.listByScope(PermissionScope.RESOURCE);
  }
  
  public boolean hasResourceRolePermission(ResourceRights resourceRights, UserRole userRole, Permission permission) {
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(resourceRights, userRole, permission);
  }
  
  @Permit (MuikkuPermissions.MANAGE_RESOURCERIGHTS)
  public ResourceUserRolePermission addResourceUserRolePermission(ResourceRights resourceRights, UserRole userRole, Permission permission) {
    return resourceUserRolePermissionDAO.create(resourceRights, userRole, permission);
  }
  
  @Permit (MuikkuPermissions.MANAGE_RESOURCERIGHTS)
  public void deleteResourceUserRolePermission(ResourceUserRolePermission rolePermission) {
    resourceUserRolePermissionDAO.delete(rolePermission);
  }

}
