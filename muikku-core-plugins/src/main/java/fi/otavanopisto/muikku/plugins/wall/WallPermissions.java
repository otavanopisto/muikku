package fi.otavanopisto.muikku.plugins.wall;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.DefaultWorkspacePermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class WallPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /* Environment */
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String WALL_READALLMESSAGES = "WALL_READALLMESSAGES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String READ_ALL_WALLS = "READ_ALL_WALLS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  public static final String WALL_WRITEENVIRONMENTWALL = "WALL_WRITEENVIRONMENTWALL";
  
  /* Workspace */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String WALL_READALLCOURSEMESSAGES = "WALL_READALLCOURSEMESSAGES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
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
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(WallPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(WallPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(WallPermissions.class, permission);
  }

}
