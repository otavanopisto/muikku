package fi.otavanopisto.muikku.plugins.communicator;

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
public class CommunicatorPermissionCollection extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.PERSONAL)
  public static final String COMMUNICATOR_MANAGE_SETTINGS = "COMMUNICATOR_MANAGE_SETTINGS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.TEACHER })
  public static final String COMMUNICATOR_STUDENT_MESSAGING = "COMMUNICATOR_STUDENT_MESSAGING";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER })
  public static final String COMMUNICATOR_GROUP_MESSAGING = "COMMUNICATOR_GROUP_MESSAGING";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultWorkspacePermissionRoles ({ WorkspaceRoleArchetype.TEACHER })
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER })
  public static final String COMMUNICATOR_WORKSPACE_MESSAGING = "COMMUNICATOR_WORKSPACE_MESSAGING";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(CommunicatorPermissionCollection.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(CommunicatorPermissionCollection.class, permission);
  }
  
  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(CommunicatorPermissionCollection.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(CommunicatorPermissionCollection.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(CommunicatorPermissionCollection.class, permission);
  }
}
