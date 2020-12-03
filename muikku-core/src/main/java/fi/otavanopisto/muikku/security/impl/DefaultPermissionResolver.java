package fi.otavanopisto.muikku.security.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
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

  private static final Set<String> HANDLED_SCOPES = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(PermissionScope.ENVIRONMENT, PermissionScope.WORKSPACE)));
  
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
      return HANDLED_SCOPES.contains(perm.getScope());
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
    
    if (!HANDLED_SCOPES.contains(permissionEntity.getScope())) {
      logger.severe(String.format("hasPermission called for permission %s which doesn't have correct scope", permission));
      return false;
    }
    
    UserEntity userEntity = getUserEntity(user);
    if (userEntity == null) {
      return hasEveryonePermission(permission, contextReference);
    }
    
    SchoolDataIdentifier userIdentifier = userEntity.defaultSchoolDataIdentifier();
    
    if (permissionEntity.getScope().equals(PermissionScope.WORKSPACE)) {
      // Workspace access

      WorkspaceEntity workspaceEntity = contextReference != null ? resolveWorkspace(contextReference) : null;
      if (workspaceEntity != null) {
        if (hasWorkspaceAccess(workspaceEntity, userIdentifier, permissionEntity)) {
          return true;
        } else {
          // No access from workspace permissions

          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userIdentifier);

          OrganizationEntity userOrganization = userSchoolDataIdentifier.getOrganization();
          OrganizationEntity workspaceOrganization = workspaceEntity.getOrganizationEntity();

          return 
              userOrganization != null 
              && workspaceOrganization != null 
              && Objects.equals(userOrganization.getId(), workspaceOrganization.getId())
              && hasEnvironmentAccess(userIdentifier, permissionEntity);
        }
      } else {
        // workspace is not defined
        logger.severe(String.format("hasPermission called for workspace permission %s with undefined workspace", permission));
        return false;
      }
    } else {
      // Environment access
      return hasEnvironmentAccess(userIdentifier, permissionEntity);
    }
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
