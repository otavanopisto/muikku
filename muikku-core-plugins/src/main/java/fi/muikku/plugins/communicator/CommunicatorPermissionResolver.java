package fi.muikku.plugins.communicator;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.muikku.controller.CourseController;
import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.ResourceRightsController;
import fi.muikku.dao.courses.CourseUserDAO;
import fi.muikku.dao.security.PermissionDAO;
import fi.muikku.dao.security.ResourceUserRolePermissionDAO;
import fi.muikku.dao.users.EnvironmentUserDAO;
import fi.muikku.dao.users.SystemUserRoleDAO;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.security.Permission;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserRole;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.PermissionScope;
import fi.muikku.security.User;

@RequestScoped
public class CommunicatorPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private ResourceUserRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private CourseUserDAO courseUserDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;

  @Inject
  private CommunicatorPermissionCollection permissionCollection;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private CourseController courseController;
  
  @Inject
  private EnvironmentController environmentController;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
  @Override
  public boolean handlesPermission(String permission) {
    try {
      return permissionCollection.containsPermission(permission) && PermissionScope.PERSONAL.equals(permissionCollection.getPermissionScope(permission));
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
      return false;
    }
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    UserEntity user2 = resolveUser(contextReference);
    
    return ((UserEntity) user).getId().equals(user2.getId());
    
//    ForumArea forumArea = getForumArea(contextReference);
//    Permission perm = permissionDAO.findByName(permission);
//    UserEntity userEntity = getUserEntity(user);
//    
//    UserRole userRole;
//    
//    // TODO: typecasts
//    if (forumArea instanceof CourseForumArea) {
//      CourseForumArea courseForum = (CourseForumArea) forumArea;
//      CourseUser courseUser = courseUserDAO.findByCourseAndUser(
//          courseController.findCourseEntityById(courseForum.getCourse()), userEntity);
//      userRole = courseUser.getCourseUserRole();
//    } else {
//      EnvironmentForumArea environmentForum = (EnvironmentForumArea) forumArea;
//      EnvironmentUser environmentUser = environmentUserDAO.findByEnvironmentAndUser(
//          environmentController.findEnvironmentById(environmentForum.getEnvironment()), userEntity);
//      userRole = environmentUser.getRole();
//    }
//    
//    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
//        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm) ||
//        hasEveryonePermission(permission, forumArea) ||
//        userEntity.getId().equals(forumArea.getOwner());
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    try {
      if (PermissionScope.PERSONAL.equals(permissionCollection.getPermissionScope(permission)))
        return false;
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
    }

    return false;
    
//    ForumArea forumArea = getForumArea(contextReference);
//    UserRole userRole = getEveryoneRole();
//    Permission perm = permissionDAO.findByName(permission);
//    
//    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
//        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm);
  }
  
}
