package fi.muikku.session.local;

import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.dao.base.EnvironmentDAO;
import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.security.CourseUserRolePermissionDAO;
import fi.muikku.dao.security.EnvironmentUserRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceUserRolePermissionDAO;
import fi.muikku.dao.security.UserPasswordDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.users.UserImplDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.UserPassword;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.UserImpl;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.Permit;
import fi.muikku.session.AbstractSessionController;
import fi.muikku.utils.RequestUtils;

@Stateful
@SessionScoped
@Named ("localSession")
@LocalSession
public class LocalSessionControllerImpl extends AbstractSessionController implements LocalSessionController {

  // TODO: In the right place? Refers to a local implementation
  @Inject
  private UserImplDAO userImplDAO;
  
  @Inject
  private UserEntityDAO userEntityDAO;

  @Inject
  private CourseEntityDAO courseDAO;

  @Inject
  private UserPasswordDAO userPasswordDAO;

  @Inject
  private EnvironmentDAO environmentDAO;

  @Inject
  private EnvironmentUserRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private CourseUserRolePermissionDAO courseUserRolePermissionDAO;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private ResourceUserRolePermissionDAO resourceUserRolePermissionDAO; 

  @Override
  public void login(String email, String password) {
    // TODO PK: Move to internal login plugin?
    String passwordHash = RequestUtils.md5EncodeString(password);

    UserImpl user = userImplDAO.findByEmail(email);
    UserPassword userPassword = userPasswordDAO.findByUser(user.getUserEntity());

    if (userPassword.getPasswordHash().equals(passwordHash))
      loggedUserId = user.getId();
  }

  @Override
  public void logout() {
    loggedUserId = null;
  }

  @Override
  public Locale getLocale() {
    if (locale != null)
      return locale;
    else
      return FacesContext.getCurrentInstance().getExternalContext().getRequestLocale();
  }

  @Override
  public void setLocale(Locale locale) {
    this.locale = locale;
  }

  @Permit(MuikkuPermissions.REPRESENT_USER)
  public void representUser(Long userId) {
    representedUserId = userId;
  }

  @Permit(MuikkuPermissions.REPRESENT_USER)
  public void representUser(String userId) {
    representUser(NumberUtils.createLong(userId));
  }

  public void endRepresentation() {
    representedUserId = null;
  }

  public boolean isLoggedIn() {
    return loggedUserId != null;
  }
  
  public boolean isRepresenting() {
    return representedUserId != null;
  }

  @Override
  public boolean hasEnvironmentPermission(String permission, Environment environment) {
    Permission perm = permissionDAO.findByName(permission);
    return hasEnvironmentPermissionImpl(perm, environment);
  }
  
  @Override
  public boolean hasCoursePermission(String permission, CourseEntity course) {
    Permission perm = permissionDAO.findByName(permission);
    return hasCoursePermissionImpl(perm, course);
  }
  
  /**
   * Returns User object to be used in UI etc for user related actions. Changes it's appearance if user is represented or not.
   * 
   * @return user for general use
   */
  public UserEntity getUser() {
    if (!isRepresenting())
      return getLoggedUser();
    else
      return getRepresentedUser();
  }
  
  /**
   * Returns User object for represented user. If no representation is active, returns null.
   * 
   * @return
   */
  public UserEntity getRepresentedUser() {
    return userEntityDAO.findById(representedUserId);
  }

  /**
   * Returns original logged in user.
   * 
   * @return
   */
  public UserEntity getLoggedUser() {
    if (loggedUserId != null)
      return userEntityDAO.findById(loggedUserId);
    
    return null;
  }

  public Environment getEnvironment() {
    if (environmentId != null)
      return environmentDAO.findById(environmentId);
    
    return null;
  }

  public CourseEntity getCourse() {
    // TODO Relevance?
    Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
    Long courseId = Long.valueOf(params.get("courseId"));

    return courseDAO.findById(courseId);
  }

  @PostConstruct
  private void init() {
    loggedUserId = null;
    representedUserId = null;
    // TODO: Implement environment
    environmentId = 1l;
  }

  @Override
  protected boolean hasPermissionImpl(Permission permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission.getName());
    
    if (isLoggedIn()) {
      if (!isRepresenting()) {
        return isSuperuser() || permissionResolver.hasPermission(permission.getName(), contextReference, getUser());
      } else {
        boolean repHasPermission = permissionResolver.hasPermission(permission.getName(), contextReference, getRepresentedUser());
        boolean loggedInHasPermission = isSuperuser(getLoggedUser()) || permissionResolver.hasPermission(permission.getName(), contextReference, getLoggedUser());

        return repHasPermission && loggedInHasPermission;
      }
    } else {
      return permissionResolver.hasEveryonePermission(permission.getName(), contextReference);
    }
  }
  
  @Override
  protected boolean hasEnvironmentPermissionImpl(Permission permission, Environment environment) {
    return hasPermissionImpl(permission, environment);
  }

  @Override
  protected boolean hasCoursePermissionImpl(Permission permission, CourseEntity course) {
    return hasPermissionImpl(permission, course);
  }
  
  @Override
  protected boolean hasResourcePermissionImpl(Permission permission, ResourceEntity resource) {
    return hasPermissionImpl(permission, resource);
  }
  
  private Locale locale;

  private Long environmentId;

  private Long loggedUserId;

  private Long representedUserId;
}
