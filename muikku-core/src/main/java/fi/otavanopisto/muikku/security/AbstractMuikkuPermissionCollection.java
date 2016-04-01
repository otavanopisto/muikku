package fi.otavanopisto.muikku.security;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.security.AbstractPermissionCollection;


public class AbstractMuikkuPermissionCollection extends AbstractPermissionCollection {
  
  public static final String EVERYONE = "EVERYONE";

  public static final String GROUP_TEACHER = "Group Teacher";
  public static final String GROUP_STUDENT = "Group Student";
  
  protected String[] getDefaultPseudoRoles(Class<?> collectionClass, String permission) throws NoSuchFieldException {
    DefaultPermissionRoles annotation = collectionClass.getField(permission).getAnnotation(DefaultPermissionRoles.class);

    if (annotation != null)
      return annotation.value();
    else
      return null;
  }

  protected EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(Class<?> collectionClass, String permission) throws NoSuchFieldException {
    DefaultEnvironmentPermissionRoles annotation = collectionClass.getField(permission).getAnnotation(DefaultEnvironmentPermissionRoles.class);

    if (annotation != null)
      return annotation.value();
    else
      return null;
  }

  protected WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(Class<?> collectionClass, String permission) throws NoSuchFieldException {
    DefaultWorkspacePermissionRoles annotation = collectionClass.getField(permission).getAnnotation(DefaultWorkspacePermissionRoles.class);

    if (annotation != null)
      return annotation.value();
    else
      return null;
  }
  
}
