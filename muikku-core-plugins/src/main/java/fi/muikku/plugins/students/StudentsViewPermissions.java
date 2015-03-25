package fi.muikku.plugins.students;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultEnvironmentPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.otavanopisto.security.Scope;

@ApplicationScoped
public class StudentsViewPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /* Environment */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  public static final String MANAGE_STUDENTS = "MANAGE_STUDENTS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  public static final String MANAGE_STUDENTS_VIEW_STUDENT = "MANAGE_STUDENTS_VIEW_STUDENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  public static final String MANAGE_STUDENTS_VIEW_STUDENT_STUDYPLAN = "MANAGE_STUDENTS_VIEW_STUDENT_STUDYPLAN";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultEnvironmentPermissionRoles ({ EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.TEACHER })
  public static final String MANAGE_STUDENTS_VIEW_STUDENT_CREDITS = "MANAGE_STUDENTS_VIEW_STUDENT_CREDITS";

  
  /* Workspace */
  
//  @Scope (PermissionScope.WORKSPACE)
//  @DefaultPermissionRoles ({ MANAGER, WORKSPACE_TEACHER })
//  public static final String XXX = "XXX";

  @Override
  public List<String> listPermissions() {
    return listPermissions(StudentsViewPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(StudentsViewPermissions.class, permission);
  }

  @Override
  public String[] getDefaultPseudoRoles(String permission) throws NoSuchFieldException {
    return getDefaultPseudoRoles(StudentsViewPermissions.class, permission);
  }

  @Override
  public EnvironmentRoleArchetype[] getDefaultEnvironmentRoles(String permission) throws NoSuchFieldException {
    return getDefaultEnvironmentRoles(StudentsViewPermissions.class, permission);
  }

  @Override
  public WorkspaceRoleArchetype[] getDefaultWorkspaceRoles(String permission) throws NoSuchFieldException {
    return getDefaultWorkspaceRoles(StudentsViewPermissions.class, permission);
  }

}
