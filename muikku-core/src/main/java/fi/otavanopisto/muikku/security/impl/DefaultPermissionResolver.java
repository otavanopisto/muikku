package fi.otavanopisto.muikku.security.impl;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class DefaultPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private PermissionController permissionController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionController.findByName(permission);
    if (perm != null) {
      return PermissionScope.ENVIRONMENT.equals(perm.getScope()) || PermissionScope.WORKSPACE.equals(perm.getScope()); 
    }
    return false;
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    Permission permissionEntity = permissionController.findByName(permission);
    if (permissionEntity == null) {
      logger.severe(String.format("Reference to missing permission %s", permission));
      return false;
    }
    UserEntity userEntity = getUserEntity(user);
    if (userEntity == null) {
      return hasEveryonePermission(permission, contextReference);
    }
    
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
    // Workspace access
    if (permissionEntity.getScope().equals(PermissionScope.WORKSPACE) && contextReference != null) {
      WorkspaceEntity workspaceEntity = resolveWorkspace(contextReference);
      if (workspaceEntity != null) {
        if (hasWorkspaceAccess(workspaceEntity, userIdentifier, permissionEntity)) {
          return true;
        }
      }
    }
    // Environment access
    return hasEnvironmentAccess(userIdentifier, permissionEntity);
  }
  
  private boolean hasWorkspaceAccess(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier, Permission permission) {
    // Workspace access as an individual
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity != null) {
      if (permissionController.hasPermission(workspaceUserEntity.getWorkspaceUserRole(), permission)) {
        // TODO Override rules for workspace users
        return true;
      }
    }
    // Workspace access as a group member
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
    for (UserGroupEntity userGroup : userGroups) {
      // TODO Override rules for user groups
      if (permissionController.hasPermission(workspaceEntity, userGroup, permission)) {
        return true;
      }
    }
    return false;
  }

  private boolean hasEnvironmentAccess(SchoolDataIdentifier userIdentifier, Permission permission) {
    EnvironmentRoleEntity defaultIdentifierRole = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);
    if (defaultIdentifierRole != null) {
      // Environment access as an individual
      if (permissionController.hasPermission(defaultIdentifierRole, permission)) {
        // TODO Override rules for environment users
        return true;
      }
    }
    
    if (permission.getScope().equals(PermissionScope.ENVIRONMENT)) {
      // Environment access as a group member
      List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
      for (UserGroupEntity userGroup : userGroups) {
        // TODO Override rules for user groups
        if (permissionController.hasPermission(userGroup, permission)) {
          return true;
        }
      }
    }

    return false;
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission permissionEntity = permissionController.findByName(permission);
    return permissionEntity != null && permissionController.hasPermission(everyoneRole,  permissionEntity); 
  }

}
