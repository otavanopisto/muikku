package fi.muikku.plugins.students;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.security.AbstractMuikkuPermissionCollection;
import fi.muikku.security.DefaultPermissionRoles;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.Scope;

@ApplicationScoped
public class StudentsViewPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  /* Environment */
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ MANAGER, TEACHER })
  public static final String MANAGE_STUDENTS = "MANAGE_STUDENTS";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ MANAGER, TEACHER })
  public static final String MANAGE_STUDENTS_VIEW_STUDENT = "MANAGE_STUDENTS_VIEW_STUDENT";

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ MANAGER, TEACHER })
  public static final String MANAGE_STUDENTS_VIEW_STUDENT_STUDYPLAN = "MANAGE_STUDENTS_VIEW_STUDENT_STUDYPLAN";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ MANAGER, TEACHER })
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
  public String[] getDefaultRoles(String permission) throws NoSuchFieldException {
    return getDefaultRoles(StudentsViewPermissions.class, permission);
  }
}
