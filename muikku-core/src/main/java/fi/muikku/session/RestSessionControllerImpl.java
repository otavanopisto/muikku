package fi.muikku.session;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;

@Stateful
@RequestScoped
@RestSesssion
public class RestSessionControllerImpl extends AbstractSessionController implements RestSessionController {
  
  @Override
  public void setAuthentication(RestAuthentication authentication) {
    this.authentication = authentication;
    this.activeUserIdentifier = authentication.getActiveUserIdentifier();
    this.activeUserSchoolDataSource = authentication.getActiveUserSchoolDataSource();
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
      return isSuperuser() || permissionResolver.hasPermission(permission, contextReference, getLoggedUserEntity());
    } else {
      return permissionResolver.hasEveryonePermission(permission, contextReference);
    }
  }

  @Override
  public void addOAuthAccessToken(String strategy, Date expires, String accessToken) {
    accessTokens.put(strategy, new AccessToken(accessToken, expires));
  }

  @Override
  public AccessToken getOAuthAccessToken(String strategy) {
    return accessTokens.get(strategy);
  }

  @Override
  public String getLoggedUserIdentifier() {
    return activeUserIdentifier;
  }

  @Override
  public String getLoggedUserSchoolDataSource() {
    return activeUserSchoolDataSource;
  }
  
  @Override
  public void login(String dataSource, String identifier) {
    this.activeUserIdentifier = identifier;
    this.activeUserSchoolDataSource = dataSource;
  }
  
  private RestAuthentication authentication;
  private Locale locale;
  private String activeUserIdentifier;
  private String activeUserSchoolDataSource;
  private Map<String, AccessToken> accessTokens = Collections.synchronizedMap(new HashMap<String, AccessToken>());
}
