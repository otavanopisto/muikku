package fi.otavanopisto.muikku.security.impl;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.EnvironmentGroupPermissionDAO;
import fi.otavanopisto.muikku.dao.security.EnvironmentRolePermissionDAO;
import fi.otavanopisto.muikku.dao.security.EnvironmentUserPermissionOverrideDAO;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentUserDAO;
import fi.otavanopisto.muikku.model.security.EnvironmentUserPermissionOverride;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.PermissionOverrideState;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class EnvironmentPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentUserPermissionOverrideDAO environmentUserPermissionOverrideDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;

  @Inject
  private EnvironmentRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private EnvironmentGroupPermissionDAO environmentGroupPermissionDAO;
  
  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    
    if (perm != null)
      return (PermissionScope.ENVIRONMENT.equals(perm.getScope()));
    else
      return false;
  }

  private boolean checkWorkspaceGroupRole(UserEntity userEntity, Permission perm) {
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserEntity(userEntity);
    
    for (UserGroupEntity userGroup : userGroups) {
      if (environmentGroupPermissionDAO.hasEnvironmentPermissionAccess(userGroup, perm))
        return true;
    }
    
    return false;
  }
  
  private boolean checkEnvironmentPermission(UserEntity userEntity, Permission perm) {
    EnvironmentUser environmentUser = environmentUserDAO.findByUserAndArchived(userEntity, Boolean.FALSE);

    EnvironmentUserPermissionOverride override = environmentUserPermissionOverrideDAO.findByEnvironmentUserAndPermission(environmentUser, perm);
    if (override != null)
      return override.getState() == PermissionOverrideState.ALLOW;
    else
      return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(environmentUser.getRole(), perm);
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);

    if (checkEnvironmentPermission(userEntity, perm))
      return true;
    
    return checkWorkspaceGroupRole(userEntity, perm);
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    RoleEntity everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(everyoneRole, perm);
  }
}
