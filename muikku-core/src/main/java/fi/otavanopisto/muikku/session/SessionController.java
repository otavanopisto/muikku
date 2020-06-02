package fi.otavanopisto.muikku.session;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.util.ResourceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.security.ContextReference;

public interface SessionController {

  /**
   * Returns current locale
   * 
   * @return locale
   */
  public Locale getLocale();
  
  /**
   * Sets locale
   * 
   * @param locale
   */
  public void setLocale(Locale locale);
  
  /**
   * Returns whether user is logged in
   * 
   * @return whether user is logged in
   */
  public boolean isLoggedIn();
  
  /**
   * Returns whether logged user is a super user
   * @return whether logged user is a super user
   */
  public boolean isSuperuser();
  
  /**
   * Logs user out 
   */
  public void logout();

  /**
   * Logs user in
   * 
   * @param dataSource user data source
   * @param identifier user identifier
   * @param isActive is the user active (e.g. not having ended studies)
   */
  public void login(String dataSource, String identifier, boolean isActive);
  
  boolean hasPermission(String permission, ContextReference contextReference);
  
  /**
   * Returns whether logged user has specified environment permission.
   * @param permission requested permission
   * @return whether logged user has specified environment permission.
   */
  public boolean hasEnvironmentPermission(String permission);
  
  /**
   * Returns whether logged user has specified course permission.
   * @param permission requested permission
   * @return whether logged user has specified course permission.
   */
  @Deprecated
  public boolean hasCoursePermission(String permission, WorkspaceEntity course);
  
  /**
   * Returns whether logged user has specified workspace permission.
   * @param permission requested permission
   * @return whether logged user has specified workspace permission.
   */
  public boolean hasWorkspacePermission(String permission, WorkspaceEntity workspaceEntity);

  /**
   * Returns whether logged user has specified resource permission.
   * @param permission requested permission
   * @return whether logged user has specified course permission.
   */
  public boolean hasResourcePermission(String permission, ResourceEntity resource);

  /**
   * Filters list of Resources by permission
   * @param list list to filter
   * @param permissions permission for resource
   * @return filtered list
   */
  public <T> List<T> filterResources(List<T> list, String permissions);

  public void addOAuthAccessToken(String strategy, Date expiresAt, String accessToken, String refreshToken);
  
  public AccessToken getOAuthAccessToken(String strategy);
  
  public String getLoggedUserIdentifier();
  
  public String getLoggedUserSchoolDataSource();
  
  public SchoolDataIdentifier getLoggedUser();
  
  public UserEntity getLoggedUserEntity();
  
  /**
   * Returns whether the logged in user is active, e.g. staff or a student whose studies have not yet ended.
   * 
   * @return <code>true</code> if the logged in user is active, otherwise <code>false</code>
   */
  public boolean isActiveUser();
}
