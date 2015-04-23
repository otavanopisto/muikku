package fi.muikku.security.impl;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.muikku.dao.security.WorkspaceUserPermissionOverrideDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.PermissionOverrideState;
import fi.muikku.model.security.WorkspaceUserPermissionOverride;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.PermissionScope;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class WorkspacePermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceUserPermissionOverrideDAO workspaceUserPermissionOverrideDAO;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

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

    WorkspaceEntity workspaceEntity = (WorkspaceEntity) contextReference;
    List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(workspaceEntity, userEntity);
    if (workspaceUsers.isEmpty()) {
      return false;
    }
    
    // TODO: This is definitely not the way to do this 
    WorkspaceUserEntity workspaceUser = workspaceUsers.get(0);
    
    WorkspaceUserPermissionOverride override = workspaceUserPermissionOverrideDAO.findByCourseUserAndPermission(workspaceUser, perm);
    if (override != null)
      return override.getState() == PermissionOverrideState.ALLOW;
    else
      return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, workspaceUser.getWorkspaceUserRole(), perm);
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess((WorkspaceEntity) contextReference, everyoneRole, perm);
  }
}
