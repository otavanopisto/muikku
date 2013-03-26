package fi.muikku.session;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.base.EnvironmentDAO;
import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.Permission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;

@Stateful
@RequestScoped
@Named ("restSession")
@RestSesssion
public class RestSessionControllerImpl extends AbstractSessionController implements RestSessionController {
  
  @Inject
  private EnvironmentDAO environmentDAO;

  @Inject
  private CourseEntityDAO courseDAO;
  
  @Override
  public void setAuthentication(RestAuthentication authentication) {
    this.authentication = authentication;
  }

  @Override
  public Environment getEnvironment() {
    return environmentDAO.findById(environmentId);
  }
  
  @Override
  public void setEnvironmentId(Long environmentId) {
    this.environmentId = environmentId;
  }

  @Override
  public Locale getLocale() {
    return locale;
  }
  
  @Override
  public void setLocale(Locale locale) {
    this.locale = locale;
  }
  
  @Override
  public UserEntity getUser() {
    if (authentication != null)
      return authentication.getUser();
    
    return null;
  }

  @Override
  public boolean isLoggedIn() {
    if (authentication != null)
      return authentication.isLoggedIn();
    
    return false;
  }
  
  public void logout() {
    if (authentication != null)
      authentication.logout();
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

  @Override
  protected boolean hasPermissionImpl(Permission permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission.getName());

    if (isLoggedIn()) {
      return isSuperuser() || permissionResolver.hasPermission(permission.getName(), contextReference, getUser());
    } else {
      return permissionResolver.hasEveryonePermission(permission.getName(), contextReference);
    }
  }

  private RestAuthentication authentication;
  private Long environmentId = 1l; // TODO
  private Locale locale = new Locale("en", "US");
}
