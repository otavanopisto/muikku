package fi.muikku.session;

import java.util.List;
import java.util.Locale;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import fi.muikku.model.base.Environment;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.security.ContextReference;

@RequestScoped 
@Named ("muikkuSession")
public class SessionControllerDelegateImpl implements SessionControllerDelegate {

  @Override
  public Environment getEnvironment() {
    return implementation.getEnvironment();  
  }
  
  @Override
  public void setEnvironmentId(Long environmentId) {
    if (implementation instanceof MutableSessionController) {
      ((MutableSessionController) implementation).setEnvironmentId(environmentId);
    } else {
      // TODO: Proper exception
      throw new RuntimeException("Session controller is immutable");
    }
  }

  @Override
  public Locale getLocale() {
    return implementation.getLocale();
  }

  @Override
  public void setLocale(Locale locale) {
    implementation.setLocale(locale);
  }

  @Override
  public UserEntity getUser() {
    return implementation.getUser();
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
  public boolean hasEnvironmentPermission(String permission, Environment environment) {
    return implementation.hasEnvironmentPermission(permission, environment);
  }

  @Override
  public boolean hasCoursePermission(String permission, CourseEntity course) {
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
  
  private SessionController implementation;

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference) {
    return implementation.hasPermission(permission, contextReference);
  }
}
