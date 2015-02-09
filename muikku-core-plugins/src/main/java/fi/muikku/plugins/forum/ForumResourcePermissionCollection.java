package fi.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class ForumResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_CREATEENVIRONMENTFORUM = "FORUM_CREATEENVIRONMENTFORUM";
  
  @Scope ("FORUM")
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_WRITEAREA = "FORUM_WRITEAREA";
  
  @Scope ("FORUM")
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_LISTTHREADS = "FORUM_LISTTHREADS";
  
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
