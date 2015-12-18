package fi.muikku.plugins.guider;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class GuiderPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  public static final String GUIDER_VIEW = "GUIDER_VIEW";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  public static final String GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY = "GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY";

  @Override
  public List<String> listPermissions() {
    return listPermissions(GuiderPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(GuiderPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(GuiderPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(GuiderPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(GuiderPermissions.class, permission);
  }

}
