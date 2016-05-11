package fi.otavanopisto.muikku.security.impl;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;

import fi.otavanopisto.muikku.dao.security.GroupPermissionDAO;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.RolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.WorkspaceGroupPermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentUserDAO;
import fi.otavanopisto.muikku.model.security.Permission;
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
public class DefaultPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private RolePermissionDAO rolePermissionDAO;
  
  @Inject
  private GroupPermissionDAO groupPermissionDAO;

  @Inject
  private WorkspaceGroupPermissionDAO workspaceGroupPermissionDAO; 
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    if (perm != null) {
      return ArrayUtils.contains(new String[] { PermissionScope.ENVIRONMENT, PermissionScope.WORKSPACE }, perm.getScope());
    }
    return false;
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    System.out.println("Has access to " + permission);
    Permission permissionEntity = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);
    // Workspace access
    if (permissionEntity.getScope().equals(PermissionScope.WORKSPACE) && contextReference != null) {
      System.out.println("Let's check workspace level");
      WorkspaceEntity workspaceEntity = resolveWorkspace(contextReference);
      if (workspaceEntity != null) {
        if (hasWorkspaceAccess(workspaceEntity, userEntity, permissionEntity)) {
          System.out.println("Has workspace level access!");
          return true;
        }
      }
    }
    // Environment access
    return hasEnvironmentAccess(userEntity, permissionEntity);
  }
  
  private boolean hasWorkspaceAccess(WorkspaceEntity workspaceEntity, UserEntity userEntity, Permission permission) {
    // Workspace access as an individual
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserEntity(workspaceEntity, userEntity);
    if (workspaceUserEntity != null) {
      if (rolePermissionDAO.findByUserRoleAndPermission(workspaceUserEntity.getWorkspaceUserRole(), permission) != null) {
        // TODO Override rules for workspace users
        return true;
      }
    }
    // Workspace access as a group member
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserEntity(userEntity);
    for (UserGroupEntity userGroup : userGroups) {
      // TODO Override rules for user groups
      if (workspaceGroupPermissionDAO.hasWorkspacePermissionAccess(workspaceEntity, userGroup, permission)) {
        return true;
      }
    }
    return false;
  }

  private boolean hasEnvironmentAccess(UserEntity userEntity, Permission permission) {
    // Environment access as an individual
    EnvironmentUser environmentUser = environmentUserDAO.findByUserAndArchived(userEntity, Boolean.FALSE);
    if (environmentUser != null) {
      System.out.println("Checking environment access with role " + environmentUser.getRole().getName());
      if (rolePermissionDAO.findByUserRoleAndPermission(environmentUser.getRole(), permission) != null) {
        // TODO Override rules for environment users
        return true;
      }
      else {
        System.out.println("Well no, we can't find it");
      }
    }
    else {
      System.out.println("User is not an environment user at all o.O;");
    }
    // Environment access as a group member
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserEntity(userEntity);
    for (UserGroupEntity userGroup : userGroups) {
      // TODO Override rules for user groups
      if (groupPermissionDAO.findByUserGroupAndPermission(userGroup, permission) != null) {
        return true;
      }
    }
    return false;
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission permissionEntity = permissionDAO.findByName(permission);
    return permissionEntity != null && rolePermissionDAO.findByUserRoleAndPermission(everyoneRole, permissionEntity) != null;
  }

}
