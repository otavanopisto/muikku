package fi.muikku.plugins.wall;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class WallPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /* Environment */
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String WALL_READALLMESSAGES = "WALL_READALLMESSAGES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String READ_ALL_WALLS = "READ_ALL_WALLS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager", "Teacher" })
  public static final String WALL_WRITEENVIRONMENTWALL = "WALL_WRITEENVIRONMENTWALL";
  
  /* Workspace */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Workspace Teacher" })
  public static final String WALL_READALLCOURSEMESSAGES = "WALL_READALLCOURSEMESSAGES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Workspace Teacher", "Workspace Student" })
  public static final String WALL_WRITECOURSEWALL = "WALL_WRITECOURSEWALL";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(WallPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(WallPermissions.class, permission);
  }

  @Override
  public String[] getDefaultRoles(String permission) throws NoSuchFieldException {
    return getDefaultRoles(WallPermissions.class, permission);
  }
}
