package fi.otavanopisto.muikku.security.impl;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceGroupPermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceRolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceUserPermissionOverrideDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentUserDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.PermissionOverrideState;
import fi.otavanopisto.muikku.model.security.WorkspaceUserPermissionOverride;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  
  @Inject
  private WorkspaceGroupPermissionDAO workspaceGroupPermissionDAO; 
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
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

    WorkspaceEntity workspaceEntity = resolveWorkspace(contextReference);
    if (checkWorkspaceRole(workspaceEntity, userEntity, perm)) {
      return true;
    }

    if (checkEnvironmentRole(workspaceEntity, userEntity, perm)) {
      return true;
    }
    
    return checkWorkspaceGroupRole(workspaceEntity, userEntity, perm);
  }
  
  private boolean checkWorkspaceRole(WorkspaceEntity workspaceEntity, UserEntity userEntity, Permission perm) {
    List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(workspaceEntity, userEntity);
    if (workspaceUsers.isEmpty()) {
      return false;
    }
    
    // TODO: This is definitely not the way to do this 
    WorkspaceUserEntity workspaceUser = workspaceUsers.get(0);
    
    WorkspaceUserPermissionOverride override = workspaceUserPermissionOverrideDAO.findByCourseUserAndPermission(workspaceUser, perm);
    if (override != null)
      return override.getState() == PermissionOverrideState.ALLOW;
    else {
      return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, workspaceUser.getWorkspaceUserRole(), perm);
    }
  }
  
  private boolean checkWorkspaceGroupRole(WorkspaceEntity workspaceEntity, UserEntity userEntity, Permission perm) {
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserEntity(userEntity);
    
    for (UserGroupEntity userGroup : userGroups) {
      if (workspaceGroupPermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, userGroup, perm))
        return true;
    }
    
    return false;
  }

  private boolean checkEnvironmentRole(WorkspaceEntity workspaceEntity, UserEntity userEntity, Permission perm) {
    EnvironmentUser environmentUser = environmentUserDAO.findByUserAndArchived(userEntity, Boolean.FALSE);
    if (environmentUser == null) {
      return false;
    }
    
    return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, environmentUser.getRole(), perm);      
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return workspaceUserRolePermissionDAO.hasWorkspacePermissionAccess((WorkspaceEntity) contextReference, everyoneRole, perm);
  }
}
