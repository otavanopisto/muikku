package fi.muikku.controller;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceGroupPermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceGroupPermission;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

@Dependent
@Stateful
public class PermissionController {

  @Inject
  private PermissionDAO permissionDAO;

  @Inject
  private WorkspaceGroupPermissionDAO workspaceGroupPermissionDAO;
  
  public Permission findByName(String name) {
    return permissionDAO.findByName(name);
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
