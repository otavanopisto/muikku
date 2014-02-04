package fi.muikku.security.impl;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.security.WorkspaceUserPermissionOverrideDAO;
import fi.muikku.dao.workspace.WorkspaceUserEntityDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.PermissionOverrideState;
import fi.muikku.model.security.WorkspaceUserPermissionOverride;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.User;

@RequestScoped
public class WorkspacePermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceUserPermissionOverrideDAO workspaceUserPermissionOverrideDAO;
  
  @Inject
  private WorkspaceUserEntityDAO workspaceUserDAO;

  @Inject
  private WorkspaceRolePermissionDAO workspaceUserRolePermissionDAO;

  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    
    if (perm != null)
      return (PermissionScope.WORKSPACE.equals(perm.getScope()));
    else
      return false;
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);

    WorkspaceEntity workspace = (WorkspaceEntity) contextReference;
    WorkspaceUserEntity workspaceUser = workspaceUserDAO.findByWorkspaceAndUser(workspace, userEntity);
  
    WorkspaceUserPermissionOverride override = workspaceUserPermissionOverrideDAO.findByCourseUserAndPermission(workspaceUser, perm);
    if (override != null)
      return override.getState() == PermissionOverrideState.ALLOW;
    else
      return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess(workspace, workspaceUser.getWorkspaceUserRole(), perm);
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess((WorkspaceEntity) contextReference, everyoneRole, perm);
  }
}
