package fi.muikku.security;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.EnvironmentRoleType;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

@RequestScoped
public class AbstractPermissionResolver {

  @Inject
  @Any
  private Instance<CourseContextResolver> courseContextResolvers;
  
  @Inject
  @Any
  private Instance<UserContextResolver> userContextResolvers;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentUserRoleDAO;
  
  /**
   * Uses ContextResolvers to resolve course from ContextReference
   * 
   * @param contextReference
   * @return course if found, else null
   */
  protected WorkspaceEntity resolveCourse(ContextReference contextReference) {
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

  protected RoleEntity getEveryoneRole() {
    List<EnvironmentRoleEntity> roles = environmentUserRoleDAO.listByEnvironmentRoleType(EnvironmentRoleType.EVERYONE);
    if (roles.size() == 1) {
    	return roles.get(0);
    }
    
    // TODO: Proper error handling
    
    throw new RuntimeException("Several EVERYONE roles found");
  }
  
  protected UserEntity getUserEntity(User user) {
    return (UserEntity) user;
  }
  
}
