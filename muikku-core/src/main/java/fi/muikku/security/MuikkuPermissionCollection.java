package fi.muikku.security;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.security.PermissionCollection;


public interface MuikkuPermissionCollection extends PermissionCollection {

  /**
   * Return default pseudo roles of supplied permission
   * 
   * @param permission
   * @return
   * @throws NoSuchFieldException when permission is not part of this collection
   */
  String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException;

  /**
   * Return default environment role archetypes of supplied permission
   * 
   * @param permission
   * @return
   * @throws NoSuchFieldException when permission is not part of this collection
   */
  EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException;

  /**
   * Return default workspace role archetypes of supplied permission
   * 
   * @param permission
   * @return
   * @throws NoSuchFieldException when permission is not part of this collection
   */
  WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException;
  
}
