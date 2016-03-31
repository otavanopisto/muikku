package fi.otavanopisto.muikku.security.impl;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class PersonalPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Override
  public boolean handlesPermission(String permission) {
    Permission perm = permissionDAO.findByName(permission);
    
    if (perm != null)
      return (PermissionScope.PERSONAL.equals(perm.getScope()));
    else
      return false;
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    UserEntity user2 = resolveUser(contextReference);
    
    return ((UserEntity) user).getId().equals(user2.getId());
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    // There are no everyone on personal permissions
    return false;
  }

}