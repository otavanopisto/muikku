package fi.otavanopisto.muikku.plugins.guidancerequest;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.DefaultPermissionRoles;
import fi.otavanopisto.muikku.security.DefaultWorkspacePermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class GuidanceRequestPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER })
  public static final String CREATE_GUIDANCEREQUEST = "CREATE_GUIDANCEREQUEST";

  @Scope (PermissionScope.ENVIRONMENT)
//  @DefaultPermissionRoles ({ there's really no role that could do this by default })
  public static final String LIST_GUIDANCEREQUESTS = "LIST_GUIDANCEREQUESTS";
  
  @Scope (PermissionScope.USERGROUP)
  @DefaultPermissionRoles ({ GROUP_TEACHER })
  public static final String RECEIVE_USERGROUP_GUIDANCEREQUESTS = "RECEIVE_USERGROUP_GUIDANCEREQUESTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String CREATE_WORKSPACE_GUIDANCEREQUEST = "CREATE_WORKSPACE_GUIDANCEREQUEST";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_GUIDANCEREQUESTS = "LIST_WORKSPACE_GUIDANCEREQUESTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
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
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(GuidanceRequestPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(GuidanceRequestPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(GuidanceRequestPermissions.class, permission);
  }
  
}
