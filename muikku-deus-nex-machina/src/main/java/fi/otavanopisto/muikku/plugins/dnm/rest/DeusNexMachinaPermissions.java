package fi.otavanopisto.muikku.plugins.dnm.rest;

import java.util.List;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.security.AbstractMuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

public class DeusNexMachinaPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String UNEMBED_WORKSPACE_MATERIALS = "UNEMBED_WORKSPACE_MATERIALS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ( { EnvironmentRoleArchetype.ADMINISTRATOR } )
  public static final String CLEAN_WORKSPACE_MATERIALS = "CLEAN_WORKSPACE_MATERIALS";

  @Override
  public List<String> listPermissions() {
    return listPermissions(DeusNexMachinaPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(DeusNexMachinaPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(DeusNexMachinaPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(DeusNexMachinaPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(DeusNexMachinaPermissions.class, permission);
  }

}
