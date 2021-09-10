package fi.otavanopisto.muikku.session.local;

import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.users.UserEntityDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.util.OrganizationalEntity;
import fi.otavanopisto.muikku.model.util.ResourceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.AbstractSessionController;
import fi.otavanopisto.muikku.session.AccessToken;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.Permit;

@SessionScoped
@LocalSession
public class LocalSessionControllerImpl extends AbstractSessionController implements Serializable, LocalSessionController {
  
  private static final long serialVersionUID = 4947154641883149837L;
  
  @Inject
  private Logger logger;
  
  @Inject
  private HttpServletRequest httpServletRequest;

  @Inject
  private UserEntityDAO userEntityDAO;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @PostConstruct
  private void init() {
    representedUserId = null;
    setLocale(httpServletRequest.getLocale());
    accessTokens = Collections.synchronizedMap(new HashMap<String, AccessToken>());
  }

  @Override
  public void logout() {
    this.representedUserId = null;
    this.activeUserIdentifier = null;
    this.activeUserSchoolDataSource = null;
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
  @Deprecated
  public boolean hasCoursePermission(String permission, WorkspaceEntity course) {
    return hasCoursePermissionImpl(permission, course);
  }
  
  @Override
  public boolean hasWorkspacePermission(String permission, WorkspaceEntity workspaceEntity) {
    return hasCoursePermission(permission, workspaceEntity);
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
    boolean hasPermission = false;
    PermissionResolver permissionResolver = getPermissionResolver(permission);
    if (permissionResolver == null) {
      logger.severe(String.format("could not resolve permission resolver for permission %s", permission));
      return false;
    }
    
    if (isLoggedIn()) {
      if (!isRepresenting()) {
        hasPermission = isSuperuser() || permissionResolver.hasPermission(permission, contextReference, getUser());
      }
      else {
        boolean repHasPermission = permissionResolver.hasPermission(permission, contextReference, getRepresentedUser());
        boolean loggedInHasPermission = 
            isSuperuser(getLoggedUserEntity()) || 
            permissionResolver.hasPermission(permission, contextReference, getLoggedUserEntity()) || 
            permissionResolver.hasEveryonePermission(permission, contextReference);
        hasPermission = repHasPermission && loggedInHasPermission;
      }
    }
    else {
      hasPermission = permissionResolver.hasEveryonePermission(permission, contextReference);
    }
    
    // #5723: If we got permission to do something but in an organizational context, deny permission if
    // the context belongs to another organization, unless the logged in user happens to be:
    // - ADMINISTRATOR (who have access everywhere nonetheless)
    // - STUDENT (who can study courses of other organizations)
    // - CUSTOM (custom roles such as trusted system)
    
    if (hasPermission && isLoggedIn() && contextReference instanceof OrganizationalEntity) {
      SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(getLoggedUserSchoolDataSource());
      if (schoolDataSource != null) {
        UserSchoolDataIdentifier usdi = userSchoolDataIdentifierDAO.findByDataSourceAndIdentifierAndArchived(
            schoolDataSource,
            getLoggedUserIdentifier(),
            Boolean.FALSE);
        if (usdi != null) {
          OrganizationEntity orgA = usdi.getOrganization();
          OrganizationEntity orgB = ((OrganizationalEntity) contextReference).getOrganizationEntity();
          if (orgA != null && orgB != null && !Objects.equals(orgA.getId(), orgB.getId())) {
            EnvironmentRoleEntity roleEntity = usdi.getRole();
            EnvironmentRoleArchetype loggedUserRole = roleEntity != null ? roleEntity.getArchetype() : null;
            hasPermission = loggedUserRole == EnvironmentRoleArchetype.ADMINISTRATOR ||
                loggedUserRole == EnvironmentRoleArchetype.STUDENT ||
                loggedUserRole == EnvironmentRoleArchetype.CUSTOM;
          }
        }
      }
    }
    
    return hasPermission;
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
  public SchoolDataIdentifier getLoggedUser() {
    return new SchoolDataIdentifier(getLoggedUserIdentifier(), getLoggedUserSchoolDataSource());
  }

  @Override
  public void login(String dataSource, String identifier) {
    this.activeUserIdentifier = identifier;
    this.activeUserSchoolDataSource = dataSource;
  }
  
  private Long representedUserId;
  
  private String activeUserIdentifier;
  
  private String activeUserSchoolDataSource;
  
  private Map<String, AccessToken> accessTokens;
}
