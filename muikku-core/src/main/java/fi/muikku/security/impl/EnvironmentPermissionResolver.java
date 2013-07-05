package fi.muikku.security.impl;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.security.EnvironmentUserPermissionOverrideDAO;
import fi.muikku.dao.security.EnvironmentUserRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.EnvironmentUserPermissionOverride;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.PermissionOverrideState;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserRole;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.User;

@RequestScoped
public class EnvironmentPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private EnvironmentUserPermissionOverrideDAO environmentUserPermissionOverrideDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;

  @Inject
  private EnvironmentUserRolePermissionDAO environmentUserRolePermissionDAO;

  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    
    if (perm != null)
      return (PermissionScope.ENVIRONMENT.equals(perm.getScope()));
    else
      return false;
//      throw new RuntimeException("EnvironmentPermissionResolver - Permission '" + permission + "' not found");
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    Environment environment = resolveEnvironment(contextReference);
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);

    EnvironmentUser environmentUser = environmentUserDAO.findByEnvironmentAndUser(environment, userEntity);
  
    EnvironmentUserPermissionOverride override = environmentUserPermissionOverrideDAO.findByEnvironmentUserRoleAndPermission(environmentUser, perm);
    if (override != null)
      return override.getState() == PermissionOverrideState.ALLOW;
    else
      return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(environment, environmentUser.getRole(), perm);
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    Environment environment = resolveEnvironment(contextReference);
    UserRole everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return environmentUserRolePermissionDAO.hasEnvironmentPermissionAccess(environment, everyoneRole, perm);
  }
}
