package fi.otavanopisto.muikku.plugins.guider;

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
public class GuiderPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER } )
  public static final String GUIDER_VIEW = "GUIDER_VIEW";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER } )
  public static final String GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY = "GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER  } )
  public static final String GUIDER_LIST_NOTIFICATIONS = "GUIDER_LIST_NOTIFICATIONS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String GUIDER_DELETE_TORFILE = "GUIDER_DELETE_TORFILE";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER  } )
  public static final String GUIDER_LIST_TORFILES = "GUIDER_LIST_TORFILES";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER } )
  public static final String GUIDER_GET_TORFILE_CONTENT = "GUIDER_GET_TORFILE_CONTENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER, EnvironmentRoleArchetype.STUDY_GUIDER } )
  public static final String ACCESS_CONTACT_LOG = "ACCESS_CONTACT_LOG";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ({ WorkspaceRoleArchetype.TEACHER })
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER })
  public static final String ACCESS_CONTACT_LOG_FOR_WORKSPACES = "ACCESS_CONTACT_LOG_FOR_WORKSPACES";
  
  
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
