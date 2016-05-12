package fi.otavanopisto.muikku.controller;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.GroupPermissionDAO;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.RolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceGroupPermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.RolePermission;
import fi.otavanopisto.muikku.model.security.WorkspaceGroupPermission;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;

public class PermissionController {

  @Inject
  private PermissionDAO permissionDAO;

  @Inject
  private GroupPermissionDAO groupPermissionDAO;

  @Inject
  private RolePermissionDAO rolePermissionDAO;
  
  @Inject
  private WorkspaceGroupPermissionDAO workspaceGroupPermissionDAO;
  
  public Permission findByName(String name) {
    return permissionDAO.findByName(name);
  }

  public List<Permission> listPermissionsByScope(String scope) {
    return permissionDAO.listByScope(scope);
  }
  
  public boolean hasPermission(RoleEntity role, Permission permission) {
    return rolePermissionDAO.findByUserRoleAndPermission(role, permission) != null;
  }

  public boolean hasPermission(UserGroupEntity userGroupEntity, Permission permission) {
    return groupPermissionDAO.findByUserGroupAndPermission(userGroupEntity, permission) != null;
  }

  public boolean hasPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity, Permission permission) {
    return workspaceGroupPermissionDAO.findByGroupAndPermission(workspaceEntity, userGroupEntity, permission) != null;
  }
  
  public boolean hasWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity, Permission permission) {
    return workspaceGroupPermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, userGroupEntity, permission);
  }

  public RolePermission findRolePermission(RoleEntity roleEntity, Permission permission) {
    return rolePermissionDAO.findByUserRoleAndPermission(roleEntity, permission);
  }
  
  public WorkspaceGroupPermission findWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity,
      Permission permission) {
    return workspaceGroupPermissionDAO.findByGroupAndPermission(workspaceEntity, userGroupEntity, permission);
  }
  
  public WorkspaceGroupPermission addWorkspaceGroupPermission(WorkspaceEntity workspaceEntity, UserGroupEntity userGroupEntity,
      Permission permission) {
    return workspaceGroupPermissionDAO.create(workspaceEntity, userGroupEntity, permission);
  }

  public void removeWorkspaceGroupPermission(WorkspaceGroupPermission workspaceGroupPermission) {
    workspaceGroupPermissionDAO.delete(workspaceGroupPermission);
  }

}
