package fi.otavanopisto.muikku.plugins.announcer;

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
public class AnnouncerPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String CREATE_ANNOUNCEMENT = "CREATE_ANNOUNCEMENT";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles( { WorkspaceRoleArchetype.TEACHER } )
  public static final String CREATE_WORKSPACE_ANNOUNCEMENT = "CREATE_WORKSPACE_ANNOUNCEMENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String UPDATE_ANNOUNCEMENT = "UPDATE_ANNOUNCEMENT";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles( { WorkspaceRoleArchetype.TEACHER } )
  public static final String UPDATE_WORKSPACE_ANNOUNCEMENT = "UPDATE_WORKSPACE_ANNOUNCEMENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String DELETE_ANNOUNCEMENT = "DELETE_ANNOUNCEMENT";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles( { WorkspaceRoleArchetype.TEACHER } )
  public static final String DELETE_WORKSPACE_ANNOUNCEMENT = "DELETE_WORKSPACE_ANNOUNCEMENT";
  
  /**
   * By default group announcements are shown only to group users, but 
   * with this permission roles may be permitted to list them too.
   */
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  public static final String LIST_ENVIRONMENT_GROUP_ANNOUNCEMENTS = "LIST_ENVIRONMENT_GROUP_ANNOUNCEMENTS";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles( { WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.STUDENT } )
  public static final String LIST_WORKSPACE_ANNOUNCEMENTS = "LIST_WORKSPACE_ANNOUNCEMENTS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDENT } )
  public static final String FIND_ANNOUNCEMENT = "FIND_ANNOUNCEMENT";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String ANNOUNCER_TOOL = "ANNOUNCER_TOOL";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER } )
  @DefaultWorkspacePermissionRoles( {WorkspaceRoleArchetype.TEACHER } )
  public static final String WORKSPACE_ANNOUNCER_TOOL = "WORKSPACE_ANNOUNCER_TOOL";
  	
  @Override
  public List<String> listPermissions() {
    return listPermissions(AnnouncerPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(AnnouncerPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(AnnouncerPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(AnnouncerPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(AnnouncerPermissions.class, permission);
  }

}
