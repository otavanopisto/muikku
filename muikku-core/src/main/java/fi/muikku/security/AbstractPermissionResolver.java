package fi.muikku.security;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.users.SystemUserRoleDAO;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.SystemUserRoleType;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserRole;

@RequestScoped
public class AbstractPermissionResolver {

  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;

  @Inject
  @Any
  private Instance<CourseContextResolver> courseContextResolvers;
  
  @Inject
  @Any
  private Instance<UserContextResolver> userContextResolvers;
  
  /**
   * Uses ContextResolvers to resolve course from ContextReference
   * 
   * @param contextReference
   * @return course if found, else null
   */
  protected CourseEntity resolveCourse(ContextReference contextReference) {
    for (CourseContextResolver resolver : courseContextResolvers) {
      if (resolver.handlesContextReference(contextReference))
        return resolver.resolveCourse(contextReference);
    }
    
    return null;
  }

  /**
   * Uses ContextResolvers to resolve user from ContextReference
   * 
   * @param contextReference
   * @return user if found, else null
   */
  protected UserEntity resolveUser(ContextReference contextReference) {
    for (UserContextResolver resolver : userContextResolvers) {
      if (resolver.handlesContextReference(contextReference))
        return resolver.resolveUser(contextReference);
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
