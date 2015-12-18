package fi.muikku.controller;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceGroupPermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceGroupPermission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

public class PermissionController {

  @Inject
  private PermissionDAO permissionDAO;

  @Inject
  private EnvironmentRolePermissionDAO environmentRolePermissionDAO;

  @Inject
  private WorkspaceGroupPermissionDAO workspaceGroupPermissionDAO;
  
  public Permission findByName(String name) {
    return permissionDAO.findByName(name);
  }

  public List<Permission> listPermissionsByScope(String scope) {
    return permissionDAO.listByScope(scope);
  }
  
  public boolean hasEnvironmentPermission(RoleEntity role, Permission permission) {
    return environmentRolePermissionDAO.hasEnvironmentPermissionAccess(role, permission);
  }

  public boolean hasWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity, Permission permission) {
    return workspaceGroupPermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, userGroupEntity, permission);
  }

  public WorkspaceGroupPermission findWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity,
      Permission permission) {
    return workspaceGroupPermissionDAO.findByGroupAndPermission(workspaceEntity, userGroupEntity, permission);
  }
  
  public WorkspaceGroupPermission addWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity,
      Permission permission) {
    return workspaceGroupPermissionDAO.create(workspaceEntity, userGroupEntity, permission);
  }

  public void removeWorkspaceGroupPermission(WorkspaceGroupPermission workspaceRolePermission) {
    workspaceGroupPermissionDAO.delete(workspaceRolePermission);
  }

}
