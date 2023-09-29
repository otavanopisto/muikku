package fi.otavanopisto.muikku.session;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;

import fi.otavanopisto.muikku.dao.users.SuperUserDAO;
import fi.otavanopisto.muikku.dao.users.UserSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.util.ResourceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;

public abstract class AbstractSessionController implements SessionController {

  private static final String[] SUPPORTED_LOCALES = {"fi", "en"};

  @Inject
  private SuperUserDAO superUserDAO;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierDAO userSchoolDataIdentifierDAO;

  @Override
  public boolean isSuperuser() {
    if (isLoggedIn())
      return isSuperuser(getLoggedUserEntity());
    else
      return false;
  }

  @Override
  public Locale getLocale() {
    if (locale == null) {
      locale = new Locale(SUPPORTED_LOCALES[0]);
    }
    return locale;
  }

  @Override
  public void setLocale(Locale locale) {
    this.locale = resolveLocale(locale);
  }

  @Override
  public boolean hasRole(EnvironmentRoleArchetype role) {
    return hasAnyRole(role);
  }
  
  @Override
  public boolean hasAnyRole(EnvironmentRoleArchetype ... roles) {
    if (getLoggedUser() != null) {
      UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierDAO.findBySchoolDataIdentifier(getLoggedUser());
      if (userSchoolDataIdentifier != null) {
        return userSchoolDataIdentifier.hasAnyRole(roles);
      }
    }
    return false;
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference) {
    return hasPermissionImpl(permission, contextReference);
  }
  
  protected boolean isSuperuser(UserEntity user) {
    return superUserDAO.findById(user.getId()) != null;
  }

  @Override
  public boolean hasEnvironmentPermission(String permission) {
    return hasEnvironmentPermissionImpl(permission);
  }
  
  @Override
  public boolean hasCoursePermission(String permission, WorkspaceEntity course) {
    return hasCoursePermissionImpl(permission, course);
  }
  
  @Override
  public boolean hasResourcePermission(String permission, ResourceEntity resource) {
    return hasResourcePermissionImpl(permission, resource);
  }
  
  @Override
  public UserEntity getLoggedUserEntity() {
    if ((getLoggedUserSchoolDataSource() == null) || (getLoggedUserIdentifier() == null)) {
      return null;
    }
    
    return userEntityController.findUserEntityByDataSourceAndIdentifier(getLoggedUserSchoolDataSource(), getLoggedUserIdentifier());
  }
  
  @Inject
  @Any
  private Instance<PermissionResolver> permissionResolvers;
  
  protected PermissionResolver getPermissionResolver(String permission) {
    for (PermissionResolver resolver : permissionResolvers) {
      if (resolver.handlesPermission(permission))
        return resolver;
    }
    
    return null;
  }
  
  @Override
  public <T> List<T> filterResources(List<T> list, String permission) {
    List<T> ret = new ArrayList<T>();
    
    for (T o : list) {
      ResourceEntity re = (ResourceEntity) o;
      
      if (hasResourcePermission(permission, re))
        ret.add(o);
    }
    
    return ret;
  }
  
  protected abstract boolean hasPermissionImpl(String permission, ContextReference contextReference);
  
  protected abstract boolean hasEnvironmentPermissionImpl(String permission);

  protected abstract boolean hasCoursePermissionImpl(String permission, WorkspaceEntity course);
  
  protected abstract boolean hasResourcePermissionImpl(String permission, ResourceEntity resource);

  private Locale resolveLocale(Locale requestLocale) {
    if (requestLocale != null && ArrayUtils.contains(SUPPORTED_LOCALES, requestLocale.getLanguage())) {
      return new Locale(requestLocale.getLanguage());
    }
    return new Locale(SUPPORTED_LOCALES[0]);
  }
  
  private Locale locale;

}
