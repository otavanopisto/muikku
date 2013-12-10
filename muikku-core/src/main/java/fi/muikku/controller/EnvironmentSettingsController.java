package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.model.security.EnvironmentRolePermission;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;

@Stateful
@Model
@Named ("environmentSettings")
public class EnvironmentSettingsController {

  @Inject
  private RoleEntityDAO userEntityDAO;

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleDAO;
  
  @Inject
  private EnvironmentRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private WorkspaceRolePermissionDAO courseUserRolePermissionDAO;
  
  public List<RoleEntity> listEnvironmentUserRoles() {
    List<RoleEntity> roles = new ArrayList<RoleEntity>();
    
    roles.addAll(environmentRoleDAO.listAll());
    
    return roles;
  }
  
  public List<Permission> listEnvironmentPermissions() {
    return permissionDAO.listByScope(PermissionScope.ENVIRONMENT);
  }

  public List<RoleEntity> listWorkspaceUserRoles() {
    List<RoleEntity> userRoles = userEntityDAO.listAll();
    
    return userRoles;
  }

  public List<Permission> listWorkspacePermissions() {
    return permissionDAO.listByScope(PermissionScope.WORKSPACE);
  }
  
  public boolean hasEnvironmentRolePermission(RoleEntity role, Permission permission) {
    return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(role, permission);
  }

  public boolean hasWorkspaceRolePermission(@PermitContext WorkspaceEntity course, RoleEntity role, Permission permission) {
    return courseUserRolePermissionDAO.hasCoursePermissionAccess(course, role, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public EnvironmentRolePermission addEnvironmentUserRolePermission(RoleEntity role, Permission permission) {
    return environmentUserRolePermissionDAO.create(role, permission);
  }
  
  @Permit(MuikkuPermissions.MANAGE_SETTINGS)
  public void deleteEnvironmentUserRolePermission(@PermitContext EnvironmentRolePermission rolePermission) {
    environmentUserRolePermissionDAO.delete(rolePermission);
  }
  
  @Permit(MuikkuPermissions.COURSE_MANAGECOURSESETTINGS)
  public WorkspaceRolePermission addWorkspaceUserRolePermission(@PermitContext WorkspaceEntity course, RoleEntity role, Permission permission) {
    return courseUserRolePermissionDAO.create(course, role, permission);
  }
  
  @Permit(MuikkuPermissions.COURSE_MANAGECOURSESETTINGS)
  public void deleteWorkspaceUserRolePermission(@PermitContext WorkspaceRolePermission rolePermission) {
    courseUserRolePermissionDAO.delete(rolePermission);
  }
  
}
