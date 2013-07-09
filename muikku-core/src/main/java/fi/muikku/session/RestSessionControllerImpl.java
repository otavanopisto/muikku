package fi.muikku.session;

import java.util.Locale;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;

@Stateful
@RequestScoped
@RestSesssion
public class RestSessionControllerImpl extends AbstractSessionController implements RestSessionController {
  
//  @Inject
//  private CourseEntityDAO courseDAO;
  
  @Override
  public void setAuthentication(RestAuthentication authentication) {
    this.authentication = authentication;
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
  protected boolean hasEnvironmentPermissionImpl(String permission) {
    return hasPermission(permission, null);
  }

  @Override
  protected boolean hasCoursePermissionImpl(String permission, WorkspaceEntity course) {
    return hasPermissionImpl(permission, course);
  }
  
  @Override
  protected boolean hasResourcePermissionImpl(String permission, ResourceEntity resource) {
    return hasPermissionImpl(permission, resource);
  }

  @Override
  protected boolean hasPermissionImpl(String permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission);

    if (isLoggedIn()) {
      return isSuperuser() || permissionResolver.hasPermission(permission, contextReference, getUser());
    } else {
      return permissionResolver.hasEveryonePermission(permission, contextReference);
    }
  }

  private RestAuthentication authentication;
  private Locale locale;

}
