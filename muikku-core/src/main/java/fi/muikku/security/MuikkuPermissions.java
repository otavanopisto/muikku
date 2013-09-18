package fi.muikku.security;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MuikkuPermissions extends AbstractPermissionCollection implements PermissionCollection {

  @Scope (PermissionScope.ENVIRONMENT)
  public static final String REPRESENT_USER = "REPRESENT_USER";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String CREATE_COURSE = "CREATE_COURSE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String JOIN_COURSE = "JOIN_COURSE";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String LIST_COURSES = "LIST_COURSES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String MANAGE_SETTINGS = "MANAGE_SETTINGS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String MANAGE_USERS = "MANAGE_USERS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String WALL_READALLMESSAGES = "WALL_READALLMESSAGES";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String READ_ALL_WALLS = "READ_ALL_WALLS";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String WALL_WRITEENVIRONMENTWALL = "WALL_WRITEENVIRONMENTWALL";
  
  @Scope (PermissionScope.ENVIRONMENT)
  public static final String LIST_CALENDARS = "LIST_CALENDARS";
  
  /* COURSE */
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String COURSE_MANAGECOURSESETTINGS = "COURSE_MANAGECOURSESETTINGS";
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String WALL_READALLCOURSEMESSAGES = "WALL_READALLCOURSEMESSAGES";
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String REPRESENT_COURSEUSER = "REPRESENT_COURSEUSER";
  
  @Scope (PermissionScope.WORKSPACE)
  public static final String EVALUATE_USER = "EVALUATE_USER";

  @Scope (PermissionScope.WORKSPACE)
  public static final String WALL_WRITECOURSEWALL = "WALL_WRITECOURSEWALL";

  /* RESOURCE */
  
  @Scope (PermissionScope.RESOURCE)
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
}
