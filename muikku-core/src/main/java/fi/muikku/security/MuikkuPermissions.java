package fi.muikku.security;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.security.Scope;


@ApplicationScoped
public class MuikkuPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ADMIN = "ADMIN";
  
  @Scope (PermissionScope.PERSONAL)
  public static final String OWNER = "OWNER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER })
  public static final String REPRESENT_USER = "REPRESENT_USER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER })
  public static final String CREATE_WORKSPACE = "CREATE_WORKSPACE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACES = "LIST_WORKSPACES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER })
  public static final String MANAGE_SETTINGS = "MANAGE_SETTINGS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER })
  public static final String MANAGE_USERS = "MANAGE_USERS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  public static final String MANAGE_MATERIAL_META = "MANAGE_MATERIAL_META";
  
  /* WORKSPACE */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER })
  public static final String JOIN_WORKSPACE = "JOIN_WORKSPACE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String WORKSPACE_MANAGEWORKSPACESETTINGS = "WORKSPACE_MANAGEWORKSPACESETTINGS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String REPRESENT_WORKSPACEUSER = "REPRESENT_WORKSPACEUSER";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String EVALUATE_USER = "EVALUATE_USER";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String VIEW_USER_EVALUATION = "VIEW_USER_EVALUATION";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String VIEW_MATERIAL_EVALUATION = "VIEW_MATERIAL_EVALUATION";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String EVALUATE_MATERIAL = "EVALUATE_MATERIAL";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_WORKSPACE_MATERIALS = "ACCESS_WORKSPACE_MATERIALS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String ACCESS_UNPUBLISHED_WORKSPACE = "ACCESS_UNPUBLISHED_WORKSPACE";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String PUBLISH_WORKSPACE = "PUBLISH_WORKSPACE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_MATERIALS = "MANAGE_WORKSPACE_MATERIALS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_STUDENTS = "LIST_WORKSPACE_STUDENTS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.STUDENT, WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_WORKSPACE_MEMBERS = "LIST_WORKSPACE_MEMBERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String MANAGE_WORKSPACE_MEMBERS = "MANAGE_WORKSPACE_MEMBERS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR })
  public static final String ARCHIVE_ALL_WORKSPACE_STUDENTS = "ARCHIVE_ALL_WORKSPACE_STUDENTS";
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String WORKSPACE_SIGNUP = "WORKSPACE_SIGNUP";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.ADMINISTRATOR })
  @DefaultWorkspacePermissionRoles({ WorkspaceRoleArchetype.TEACHER })
  public static final String LIST_ALL_JOURNAL_ENTRIES = "LIST_ALL_JOURNAL_ENTRIES";
  
  /* RESOURCE */
  
  @Scope (PermissionScope.RESOURCE)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER })
  public static final String MANAGE_RESOURCERIGHTS = "MANAGE_RESOURCERIGHTS";

  @Override
  public List<String> listPermissions() {
    return listPermissions(MuikkuPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(MuikkuPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(MuikkuPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(MuikkuPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(MuikkuPermissions.class, permission);
  }
  
}
