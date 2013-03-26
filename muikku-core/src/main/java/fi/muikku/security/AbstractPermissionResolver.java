package fi.muikku.security;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.users.SystemUserRoleDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.SystemUserRoleType;
import fi.muikku.model.users.UserRole;

@RequestScoped
public class AbstractPermissionResolver {

  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;
  
  @Inject
  @Any
  private Instance<EnvironmentContextResolver> environmentContextResolvers;

  @Inject
  @Any
  private Instance<CourseContextResolver> courseContextResolvers;
  
  /**
   * Uses ContextResolvers to resolve environment from ContextReference
   * 
   * @param contextReference
   * @return environment if found, else null
   */
  protected Environment getEnvironment(ContextReference contextReference) {
    for (EnvironmentContextResolver resolver : environmentContextResolvers) {
      if (resolver.handlesContextReference(contextReference))
        return resolver.resolveEnvironment(contextReference);
    }
    
    return null;
  }

  /**
   * Uses ContextResolvers to resolve course from ContextReference
   * 
   * @param contextReference
   * @return course if found, else null
   */
  protected CourseEntity getCourse(ContextReference contextReference) {
    for (CourseContextResolver resolver : courseContextResolvers) {
      if (resolver.handlesContextReference(contextReference))
        return resolver.resolveCourse(contextReference);
    }
    
    return null;
  }

  protected UserRole getEveryoneRole() {
    return systemUserRoleDAO.findByType(SystemUserRoleType.EVERYONE);
  }

  protected UserEntity getUserEntity(User user) {
    return (UserEntity) user;
  }
  
}
