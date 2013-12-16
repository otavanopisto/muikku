package fi.muikku.security;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MuikkuPermissions extends AbstractMuikkuPermissionCollection implements MuikkuPermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager" })
  public static final String REPRESENT_USER = "REPRESENT_USER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager" })
  public static final String CREATE_COURSE = "CREATE_COURSE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager", "Student", "Teacher" })
  public static final String LIST_COURSES = "LIST_COURSES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager" })
  public static final String MANAGE_SETTINGS = "MANAGE_SETTINGS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  @DefaultPermissionRoles ({ "Manager" })
  public static final String MANAGE_USERS = "MANAGE_USERS";
  
  /* WORKSPACE */
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Student", "Teacher" })
  public static final String JOIN_COURSE = "JOIN_COURSE";

  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Workspace Teacher" })
  public static final String COURSE_MANAGECOURSESETTINGS = "COURSE_MANAGECOURSESETTINGS";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Workspace Teacher" })
  public static final String REPRESENT_COURSEUSER = "REPRESENT_COURSEUSER";
  
  @Scope (PermissionScope.WORKSPACE)
  @DefaultPermissionRoles ({ "Manager", "Workspace Teacher" })
  public static final String EVALUATE_USER = "EVALUATE_USER";

  /* RESOURCE */
  
  @Scope (PermissionScope.RESOURCE)
  @DefaultPermissionRoles ({ "Manager" })
  public static final String MANAGE_RESOURCERIGHTS = "MANAGE_RESOURCERIGHTS";
  
  @Override
  public List<String> listPermissions() {
    return listPermissions(MuikkuPermissions.class);
  }

  @Override
  public boolean containsPermission(String permission) {
    return listPermissions().contains(permission);
  }
  
  @Override
  public String getPermissionScope(String permission) throws NoSuchFieldException {
    return getPermissionScope(MuikkuPermissions.class, permission);
  }
  
  @Override
  public String[] getDefaultRoles(String permission) throws NoSuchFieldException {
    return getDefaultRoles(MuikkuPermissions.class, permission);
  }
}
