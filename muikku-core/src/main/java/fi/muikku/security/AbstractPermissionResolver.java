package fi.muikku.security;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.users.SystemRoleEntityDAO;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.SystemRoleType;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

@RequestScoped
public class AbstractPermissionResolver {

  @Inject
  @Any
  private Instance<WorkspaceContextResolver> courseContextResolvers;
  
  @Inject
  @Any
  private Instance<UserContextResolver> userContextResolvers;
  
  @Inject
  private SystemRoleEntityDAO systemUserRoleDAO;
  
  /**
   * Uses ContextResolvers to resolve course from ContextReference
   * 
   * @param contextReference
   * @return course if found, else null
   */
  protected WorkspaceEntity resolveWorkspace(ContextReference contextReference) {
    for (WorkspaceContextResolver resolver : courseContextResolvers) {
      if (resolver.handlesContextReference(contextReference))
        return resolver.resolveWorkspace(contextReference);
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
    return systemUserRoleDAO.findByRoleType(SystemRoleType.EVERYONE);
  }
  
  protected UserEntity getUserEntity(User user) {
    return (UserEntity) user;
  }
  
}
