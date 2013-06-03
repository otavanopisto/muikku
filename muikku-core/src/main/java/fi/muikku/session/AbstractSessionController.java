package fi.muikku.session;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.courses.CourseUserDAO;
import fi.muikku.dao.security.CourseUserPermissionOverrideDAO;
import fi.muikku.dao.security.CourseUserRolePermissionDAO;
import fi.muikku.dao.security.EnvironmentUserPermissionOverrideDAO;
import fi.muikku.dao.security.EnvironmentUserRolePermissionDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.SuperUserDAO;
import fi.muikku.dao.users.SystemUserRoleDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.security.Permission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.util.ResourceEntity;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;

public abstract class AbstractSessionController implements SessionController {

  @Inject
  private SuperUserDAO superUserDAO;

  @Inject
  private EnvironmentUserRolePermissionDAO environmentUserRolePermissionDAO;

  @Inject
  private CourseUserRolePermissionDAO courseUserRolePermissionDAO;

  @Inject
  private EnvironmentUserDAO environmentUserDAO;

  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;

  @Inject
  private EnvironmentUserPermissionOverrideDAO environmentUserPermissionOverrideDAO;

  @Inject
  private CourseUserPermissionOverrideDAO courseUserPermissionOverrideDAO;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private CourseUserDAO courseUserDAO;

  @Override
  public boolean isSuperuser() {
    if (isLoggedIn())
      return isSuperuser(getUser());
    else
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
  public boolean hasEnvironmentPermission(String permission, Environment environment) {
    return hasEnvironmentPermissionImpl(permission, environment);
  }
  
  @Override
  public boolean hasCoursePermission(String permission, CourseEntity course) {
    return hasCoursePermissionImpl(permission, course);
  }
  
  @Override
  public boolean hasResourcePermission(String permission, ResourceEntity resource) {
    return hasResourcePermissionImpl(permission, resource);
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
  
  protected abstract boolean hasEnvironmentPermissionImpl(String permission, Environment environment);

  protected abstract boolean hasCoursePermissionImpl(String permission, CourseEntity course);
  
  protected abstract boolean hasResourcePermissionImpl(String permission, ResourceEntity resource);
}
