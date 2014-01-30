package fi.muikku.plugins.guidancerequest;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class GuidanceRequestPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ STUDENT, TEACHER, HEAD_OF_DPT, STUDY_ADVISOR })
  public static final String CREATE_GUIDANCEREQUEST = "CREATE_GUIDANCEREQUEST";

  @Scope (PermissionScope.ENVIRONMENT)
//  @DefaultPermissionRoles ({ HEAD_OF_DPT, STUDY_ADVISOR })
  public static final String LIST_GUIDANCEREQUESTS = "LIST_GUIDANCEREQUESTS";
  
  @Scope (PermissionScope.USERGROUP)
  @DefaultPermissionRoles ({ GROUP_TEACHER })
  public static final String RECEIVE_USERGROUP_GUIDANCEREQUESTS = "RECEIVE_USERGROUP_GUIDANCEREQUESTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ WORKSPACE_STUDENT, WORKSPACE_TEACHER, HEAD_OF_DPT, STUDY_ADVISOR })
  public static final String CREATE_WORKSPACE_GUIDANCEREQUEST = "CREATE_WORKSPACE_GUIDANCEREQUEST";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ WORKSPACE_TEACHER, HEAD_OF_DPT })
  public static final String LIST_WORKSPACE_GUIDANCEREQUESTS = "LIST_WORKSPACE_GUIDANCEREQUESTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ WORKSPACE_TEACHER })
  public static final String RECEIVE_WORKSPACE_GUIDANCEREQUESTS = "RECEIVE_WORKSPACE_GUIDANCEREQUESTS";

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
