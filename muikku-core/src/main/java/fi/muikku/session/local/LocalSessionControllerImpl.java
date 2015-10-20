package fi.muikku.session.local;

import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.AbstractSessionController;
import fi.muikku.session.AccessToken;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.Permit;

@Stateful
@SessionScoped
@LocalSession
public class LocalSessionControllerImpl extends AbstractSessionController implements Serializable, LocalSessionController {
  
  private static final long serialVersionUID = 4947154641883149837L;
  
  @Inject
  private HttpServletRequest httpServletRequest;

  @Inject
  private UserEntityDAO userEntityDAO;

  @PostConstruct
  private void init() {
    representedUserId = null;
    locale = httpServletRequest.getLocale();
  }

  @Override
  public void logout() {
  	this.representedUserId = null;
  	this.activeUserIdentifier = null;
    this.activeUserSchoolDataSource = null;
  }

  @Override
  public Locale getLocale() {
    return locale;
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
    if (getLoggedUserEntity() == null)
      return false;
    
    return activeUserIdentifier != null && this.activeUserSchoolDataSource != null;
  }
  
  public boolean isRepresenting() {
    return representedUserId != null;
  }

  @Override
  public boolean hasEnvironmentPermission(String permission) {
    return hasEnvironmentPermissionImpl(permission);
  }
  
  @Override
  public boolean hasCoursePermission(String permission, WorkspaceEntity course) {
    return hasCoursePermissionImpl(permission, course);
  }
  
  /**
   * Returns User object to be used in UI etc for user related actions. Changes it's appearance if user is represented or not.
   * 
   * @return user for general use
   */
  public UserEntity getUser() {
    if (!isRepresenting())
      return getLoggedUserEntity();
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

  @Override
  protected boolean hasPermissionImpl(String permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission);
    
    if (isLoggedIn()) {
      if (!isRepresenting()) {
        return isSuperuser() || permissionResolver.hasPermission(permission, contextReference, getUser());
      } else {
        boolean repHasPermission = permissionResolver.hasPermission(permission, contextReference, getRepresentedUser());
        boolean loggedInHasPermission = 
            isSuperuser(getLoggedUserEntity()) || 
            permissionResolver.hasPermission(permission, contextReference, getLoggedUserEntity()) || 
            permissionResolver.hasEveryonePermission(permission, contextReference);

        return repHasPermission && loggedInHasPermission;
      }
    } else {
      return permissionResolver.hasEveryonePermission(permission, contextReference);
    }
  }
  
  @Override
  protected boolean hasEnvironmentPermissionImpl(String permission) {
    return hasPermissionImpl(permission, null);
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
  public void login(String dataSource, String identifier) {
    this.activeUserIdentifier = identifier;
    this.activeUserSchoolDataSource = dataSource;
  }
  
  private Locale locale;

  private Long representedUserId;
  
  private String activeUserIdentifier;
  
  private String activeUserSchoolDataSource;
  
  private Map<String, AccessToken> accessTokens = Collections.synchronizedMap(new HashMap<String, AccessToken>());
}
