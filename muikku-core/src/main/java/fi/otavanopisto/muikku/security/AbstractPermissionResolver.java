package fi.otavanopisto.muikku.security;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.users.SystemRoleEntityDAO;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.SystemRoleType;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.User;

@RequestScoped
public class AbstractPermissionResolver {

  @Inject
  private Logger logger;
  
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
      if (resolver.handlesContextReference(contextReference)) {
        WorkspaceEntity workspaceEntity = resolver.resolveWorkspace(contextReference);
        
        if (workspaceEntity != null)
          return workspaceEntity;
        else {
          if (contextReference != null)
            logger.log(Level.WARNING, "Resolver couldn't resolve workspace from " + contextReference.getClass().getSimpleName());
          else
            logger.log(Level.WARNING, "Resolver couldn't resolve workspace from null");
          
          return null;
        }
      }
    }

    if (contextReference != null)
      logger.log(Level.WARNING, "Couldn't find workspace resolver for " + contextReference.getClass().getSimpleName());
    else
      logger.log(Level.WARNING, "Couldn't find workspace resolver for null contextReference");
    
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
      if (resolver.handlesContextReference(contextReference)) {
        UserEntity userEntity = resolver.resolveUser(contextReference);
        
        if (userEntity != null)
          return userEntity;
        else {
          if (contextReference != null)
            logger.log(Level.WARNING, "Resolver couldn't resolve user from " + contextReference.getClass().getSimpleName());
          else
            logger.log(Level.WARNING, "Resolver couldn't resolve user from null");
          
          return null;
        }
      }
    }
    
    if (contextReference != null)
      logger.log(Level.WARNING, "Couldn't find user resolver for " + contextReference.getClass().getSimpleName());
    else
      logger.log(Level.WARNING, "Couldn't find user resolver for null contextReference");

    return null;
  }

  protected RoleEntity getEveryoneRole() {
    return systemUserRoleDAO.findByRoleType(SystemRoleType.EVERYONE);
  }
  
  protected UserEntity getUserEntity(User user) {
    return (UserEntity) user;
  }
  
}
