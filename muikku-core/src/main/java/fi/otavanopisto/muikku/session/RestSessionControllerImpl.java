package fi.otavanopisto.muikku.session;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;

import fi.otavanopisto.muikku.model.util.ResourceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;

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
  @Deprecated
  protected boolean hasCoursePermissionImpl(String permission, WorkspaceEntity course) {
    return hasPermissionImpl(permission, course);
  }
  
  @Override
  public boolean hasWorkspacePermission(String permission, WorkspaceEntity workspaceEntity) {
    return hasCoursePermission(permission, workspaceEntity);
  }
  
  @Override
  protected boolean hasResourcePermissionImpl(String permission, ResourceEntity resource) {
    return hasPermissionImpl(permission, resource);
  }

  @Override
  protected boolean hasPermissionImpl(String permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission);

    if (isLoggedIn()) {
      return isSuperuser() || 
          permissionResolver.hasPermission(permission, contextReference, getLoggedUserEntity()) || 
          permissionResolver.hasEveryonePermission(permission, contextReference);
    } else {
      return permissionResolver.hasEveryonePermission(permission, contextReference);
    }
  }

  @Override
  public void addOAuthAccessToken(String strategy, Date expires, String accessToken, String refreshToken) {
    accessTokens.put(strategy, new AccessToken(accessToken, expires, refreshToken));
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
  public SchoolDataIdentifier getLoggedUser() {
    return new SchoolDataIdentifier(getLoggedUserIdentifier(), getLoggedUserSchoolDataSource());
  }
  
  @Override
  public void login(String dataSource, String identifier) {
    this.activeUserIdentifier = identifier;
    this.activeUserSchoolDataSource = dataSource;
  }
  
  private RestAuthentication authentication;
  private String activeUserIdentifier;
  private String activeUserSchoolDataSource;
  private Map<String, AccessToken> accessTokens = Collections.synchronizedMap(new HashMap<String, AccessToken>());
}
