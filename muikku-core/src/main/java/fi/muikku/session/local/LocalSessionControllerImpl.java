package fi.muikku.session.local;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.Permit;
import fi.muikku.session.AbstractSessionController;
import fi.muikku.session.AccessToken;

@Stateful
@SessionScoped
@LocalSession
public class LocalSessionControllerImpl extends AbstractSessionController implements LocalSessionController {
  
  @Inject
  private UserEntityDAO userEntityDAO;
  
  @Override
  public void login(Long userId) {
  	this.loggedUserId = userId;
  }

  @Override
  public void logout() {
  	representedUserId = null;
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

  @PostConstruct
  private void init() {
    loggedUserId = null;
    representedUserId = null;
  }

  @Override
  protected boolean hasPermissionImpl(String permission, ContextReference contextReference) {
    PermissionResolver permissionResolver = getPermissionResolver(permission);
    
    if (isLoggedIn()) {
      if (!isRepresenting()) {
        return isSuperuser() || permissionResolver.hasPermission(permission, contextReference, getUser());
      } else {
        boolean repHasPermission = permissionResolver.hasPermission(permission, contextReference, getRepresentedUser());
        boolean loggedInHasPermission = isSuperuser(getLoggedUser()) || permissionResolver.hasPermission(permission, contextReference, getLoggedUser());

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
  public void addOAuthAccessToken(String strategy, Date expires, String accessToken) {
    accessTokens.put(strategy, new AccessToken(accessToken, expires));
  }

  @Override
  public AccessToken getOAuthAccessToken(String strategy) {
    return accessTokens.get(strategy);
  }
    
  private Locale locale;

  private Long loggedUserId;

  private Long representedUserId;

  private Map<String, AccessToken> accessTokens = Collections.synchronizedMap(new HashMap<String, AccessToken>());
}
