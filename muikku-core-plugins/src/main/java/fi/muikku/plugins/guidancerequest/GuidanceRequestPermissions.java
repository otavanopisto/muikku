package fi.muikku.plugins.guidancerequest;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class GuidanceRequestPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String CREATE_GUIDANCEREQUEST = "CREATE_GUIDANCEREQUEST";

  @Scope (PermissionScope.WORKSPACE)
  public static final String CREATE_WORKSPACE_GUIDANCEREQUEST = "CREATE_WORKSPACE_GUIDANCEREQUEST";
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String LIST_WORKSPACE_GUIDANCEREQUESTS = "LIST_WORKSPACE_GUIDANCEREQUESTS";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(GuidanceRequestPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(GuidanceRequestPermissions.class, permission);
  }
  
  @Override
  public String[] getDefaultRoles(String permission) throws NoSuchFieldException {
    return getDefaultRoles(GuidanceRequestPermissions.class, permission);
  }
}
