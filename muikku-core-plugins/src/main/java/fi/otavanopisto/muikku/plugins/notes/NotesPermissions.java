package fi.otavanopisto.muikku.plugins.notes;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class NotesPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( {EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.ADMINISTRATOR})
  public static final String NOTES_VIEW = "NOTES_VIEW";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( {EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.ADMINISTRATOR})
  public static final String NOTES_CREATE = "NOTES_CREATE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( {EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.ADMINISTRATOR})
  public static final String NOTES_UPDATE = "NOTES_UPDATE";
  
   @Override
  public List<String> listPermissions() {
    return listPermissions(NotesPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(NotesPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(NotesPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(NotesPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(NotesPermissions.class, permission);
  }

}
