package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractPermissionCollection;
import fi.muikku.security.PermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class CommunicatorPermissionCollection extends AbstractPermissionCollection 
    implements PermissionCollection {

  @Scope (PermissionScope.PERSONAL)
  public static final String COMMUNICATOR_MANAGE_SETTINGS = "COMMUNICATOR_MANAGE_SETTINGS";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(CommunicatorPermissionCollection.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(CommunicatorPermissionCollection.class, permission);
  }
}
