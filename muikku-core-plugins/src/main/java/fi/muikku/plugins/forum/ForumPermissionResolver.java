package fi.muikku.plugins.forum;

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
import fi.muikku.plugins.forum.model.CourseForumArea;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.security.AbstractPermissionResolver;
import fi.muikku.security.ContextReference;
import fi.muikku.security.PermissionResolver;
import fi.muikku.security.User;

@RequestScoped
public class ForumPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private ResourceUserRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private CourseUserDAO courseUserDAO;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private SystemUserRoleDAO systemUserRoleDAO;

  @Inject
  private ForumResourcePermissionCollection permissionCollection;
  
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
    return permissionCollection.containsPermission(permission);
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    ForumArea forumArea = getForumArea(contextReference);
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);
    
    UserRole userRole;
    
    // TODO: typecasts
    if (forumArea instanceof CourseForumArea) {
      CourseForumArea courseForum = (CourseForumArea) forumArea;
      CourseUser courseUser = courseUserDAO.findByCourseAndUser(
          courseController.findCourseEntityById(courseForum.getCourse()), userEntity);
      userRole = courseUser.getCourseUserRole();
    } else {
      EnvironmentForumArea environmentForum = (EnvironmentForumArea) forumArea;
      EnvironmentUser environmentUser = environmentUserDAO.findByEnvironmentAndUser(
          environmentController.findEnvironmentById(environmentForum.getEnvironment()), userEntity);
      userRole = environmentUser.getRole();
    }
    
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm) ||
        hasEveryonePermission(permission, forumArea) ||
        userEntity.getId().equals(forumArea.getOwner());
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    ForumArea forumArea = getForumArea(contextReference);
    UserRole userRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm);
  }
  
  private ForumArea getForumArea(ContextReference contextReference) {
    if (contextReference instanceof ForumArea)
      return (ForumArea) contextReference;
    
    if (contextReference instanceof ForumThread)
      return ((ForumThread) contextReference).getForumArea();
    
    return null;
  }
  
}
