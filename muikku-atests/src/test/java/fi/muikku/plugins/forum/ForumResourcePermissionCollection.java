package fi.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.muikku.security.DefaultPermissionRoles;
import fi.muikku.security.DefaultWorkspacePermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class ForumResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  public static final String PERMISSIONSCOPE_FORUM = "FORUM";
  
  /**
   * Forum Area Groups
   */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_CREATEFORUMAREAGROUP = "FORUM_CREATEFORUMAREAGROUP";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ( EVERYONE )
  public static final String FORUM_FIND_FORUMAREAGROUP = "FORUM_FIND_FORUMAREAGROUP";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ( EVERYONE )
  public static final String FORUM_LIST_FORUMAREAGROUPS = "FORUM_LIST_FORUMAREAGROUPS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String FORUM_DELETE_FORUMAREAGROUP = "FORUM_DELETE_FORUMAREAGROUP";

  /**
   * Forum Area rights
   */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_CREATEENVIRONMENTFORUM = "FORUM_CREATEENVIRONMENTFORUM";
  
  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_LISTFORUM = "FORUM_LISTFORUM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String FORUM_DELETEENVIRONMENTFORUM = "FORUM_DELETEENVIRONMENTFORUM";

  /**
   * Workspace forum Area rights
   */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER })
  public static final String FORUM_CREATEWORKSPACEFORUM = "FORUM_CREATEWORKSPACEFORUM";

  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER } )
  public static final String FORUM_LISTWORKSPACEFORUM = "FORUM_LISTWORKSPACEFORUM";
  
  /**
   * Forum Message related rights
   */
  
  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_READMESSAGES = "FORUM_READMESSAGES";

  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_WRITEMESSAGES = "FORUM_WRITEMESSAGES";
  
  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER } )
  public static final String FORUM_DELETEMESSAGES = "FORUM_DELETEMESSAGES";

  @Scope (PERMISSIONSCOPE_FORUM)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER } )
  public static final String FORUM_EDITMESSAGES = "FORUM_EDITMESSAGES";

  @Override
  public List<String> listPermissions() {
    return listPermissions(ForumResourcePermissionCollection.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(ForumResourcePermissionCollection.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(ForumResourcePermissionCollection.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(ForumResourcePermissionCollection.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(ForumResourcePermissionCollection.class, permission);
  }
  
}
