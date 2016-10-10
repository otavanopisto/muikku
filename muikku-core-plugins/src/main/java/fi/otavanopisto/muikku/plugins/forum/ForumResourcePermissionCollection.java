package fi.otavanopisto.muikku.plugins.forum;

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
public class ForumResourcePermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /**
   * Forum Area Groups
   */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
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
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_CREATEENVIRONMENTFORUM = "FORUM_CREATEENVIRONMENTFORUM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_UPDATEENVIRONMENTFORUM = "FORUM_UPDATEENVIRONMENTFORUM";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_ACCESSENVIRONMENTFORUM = "FORUM_ACCESSENVIRONMENTFORUM";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String FORUM_DELETEENVIRONMENTFORUM = "FORUM_DELETEENVIRONMENTFORUM";

  /**
   * Workspace forum Area rights
   */
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT })
  public static final String FORUM_ACCESSWORKSPACEFORUMS = "FORUM_ACCESSWORKSPACEFORUMS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER })
  public static final String FORUM_CREATEWORKSPACEFORUM = "FORUM_CREATEWORKSPACEFORUM";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER })
  public static final String FORUM_UPDATEWORKSPACEFORUM = "FORUM_UPDATEWORKSPACEFORUM";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_LIST_WORKSPACE_FORUM = "FORUM_LIST_WORKSPACE_FORUM";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_FINDWORKSPACE_USERSTATISTICS = "FORUM_FINDWORKSPACE_USERSTATISTICS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String FORUM_DELETEWORKSPACEFORUM = "FORUM_DELETEWORKSPACEFORUM";
  
  /**
   * Forum Message related rights
   */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_READ_ENVIRONMENT_MESSAGES = "FORUM_READ_ENVIRONMENT_MESSAGES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_WRITE_ENVIRONMENT_MESSAGES = "FORUM_WRITE_ENVIRONMENT_MESSAGES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_DELETE_ENVIRONMENT_MESSAGES = "FORUM_DELETE_ENVIRONMENT_MESSAGES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_EDIT_ENVIRONMENT_MESSAGES = "FORUM_EDIT_ENVIRONMENT_MESSAGES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String FORUM_LOCK_OR_STICKIFY_MESSAGES = "FORUM_LOCK_OR_STICKIFY_MESSAGES";
  
  // Workspace forum messages
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_READ_WORKSPACE_MESSAGES = "FORUM_READ_WORKSPACE_MESSAGES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FORUM_WRITE_WORKSPACE_MESSAGES = "FORUM_WRITE_WORKSPACE_MESSAGES";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_DELETE_WORKSPACE_MESSAGES = "FORUM_DELETE_WORKSPACE_MESSAGES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_EDIT_WORKSPACE_MESSAGES = "FORUM_EDIT_WORKSPACE_MESSAGES";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ( { WorkspaceRoleArchetype.TEACHER } )
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String FORUM_LOCK_OR_STICKIFY_WORKSPACE_MESSAGES = "FORUM_LOCK_OR_STICKIFY_WORKSPACE_MESSAGES";
  
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
