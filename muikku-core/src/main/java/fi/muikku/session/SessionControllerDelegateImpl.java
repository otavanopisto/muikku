package fi.muikku.session;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.security.ContextReference;

@RequestScoped 
@Named ("muikkuSession")
public class SessionControllerDelegateImpl implements SessionControllerDelegate {

  @Override
  public Locale getLocale() {
    return implementation.getLocale();
  }

  @Override
  public void setLocale(Locale locale) {
    implementation.setLocale(locale);
  }

  @Override
  public UserEntity getLoggedUserEntity() {
    return implementation.getLoggedUserEntity();
  }

  @Override
  public boolean isLoggedIn() {
    return implementation.isLoggedIn();
  }

  @Override
  public boolean isSuperuser() {
    return implementation.isSuperuser();
  }

  @Override
  public void logout() {
    implementation.logout();
  }
  
  @Override
  public boolean hasEnvironmentPermission(String permission) {
    return implementation.hasEnvironmentPermission(permission);
  }

  @Override
  public boolean hasCoursePermission(String permission, WorkspaceEntity course) {
    return implementation.hasCoursePermission(permission, course);
  }

  @Override
  public boolean hasResourcePermission(String permission, ResourceEntity resource) {
    return implementation.hasResourcePermission(permission, resource);
  }

  @Override
  public <T> List<T> filterResources(List<T> list, String permissions) {
    return implementation.filterResources(list, permissions);
  }

  public void setImplementation(SessionController implementation) {
    this.implementation = implementation;
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference) {
    return implementation.hasPermission(permission, contextReference);
  }

  @Override
  public void addOAuthAccessToken(String strategy, Date expiresAt, String accessToken) {
    implementation.addOAuthAccessToken(strategy, expiresAt, accessToken);
  }

  @Override
  public AccessToken getOAuthAccessToken(String strategy) {
    return implementation.getOAuthAccessToken(strategy);
  }
  
  @Override
  public String getActiveUserIdentifier() {
    return implementation.getActiveUserIdentifier();
  }
  
  @Override
  public String getActiveUserSchoolDataSource() {
    return implementation.getActiveUserSchoolDataSource();
  }
  
  @Override
  public void setActiveUserIdentifier(String dataSource, String identifier) {
    implementation.setActiveUserIdentifier(dataSource, identifier);
  }
  
  private SessionController implementation;
}
