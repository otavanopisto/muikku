package fi.muikku.security.impl;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class UserGroupPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private PermissionDAO permissionDAO;
  
  /*
  
  @Inject
  private UserGroupUserDAO userGroupUserDAO;
  
  */

  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    
    if (perm != null)
      return (PermissionScope.USERGROUP.equals(perm.getScope()));
    else
      return false;
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    /*
    
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);
    
    UserGroupUser uguchaga = userGroupUserDAO.findByGroupAndUser((UserGroup) contextReference, userEntity);

    return userGroupRolePermissionDAO.hasPermissionAccess((UserGroup) contextReference, uguchaga.getRole(), perm);
    
    */
    return false;
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    /*
    
    RoleEntity everyoneRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return userGroupRolePermissionDAO.hasPermissionAccess((UserGroup) contextReference, everyoneRole, perm);
    */
    return false;
  }
}
