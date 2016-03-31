package fi.otavanopisto.muikku.plugins.forum;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.ResourceRightsController;
import fi.otavanopisto.muikku.dao.security.PermissionDAO;
import fi.otavanopisto.muikku.dao.security.ResourceRolePermissionDAO;
import fi.otavanopisto.muikku.dao.users.EnvironmentUserDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.security.AbstractPermissionResolver;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.PermissionResolver;
import fi.otavanopisto.security.User;

@RequestScoped
public class ForumPermissionResolver extends AbstractPermissionResolver implements PermissionResolver {

  @Inject
  private ResourceRolePermissionDAO resourceUserRolePermissionDAO;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private EnvironmentUserDAO environmentUserDAO;
  
  @Inject
  private ForumResourcePermissionCollection permissionCollection;
  
  @Inject
  private PermissionDAO permissionDAO;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private ResourceRightsController resourceRightsController;
  
  @Override
  public boolean handlesPermission(String permission) {
    try {
      return permissionCollection.containsPermission(permission) && ("FORUM".equals(permissionCollection.getPermissionScope(permission)));
    } catch (NoSuchFieldException e) {
      return false;
    }
  }
  
  @Override
  public boolean hasPermission(String permission, ContextReference contextReference, User user) {
    ForumArea forumArea = getForumArea(contextReference);
    Permission perm = permissionDAO.findByName(permission);
    UserEntity userEntity = getUserEntity(user);
    
    if (forumArea == null) {
      return false;
    }
    
    RoleEntity userRole;
    
    // TODO: typecasts
    if (forumArea instanceof WorkspaceForumArea) {
      WorkspaceForumArea workspaceForum = (WorkspaceForumArea) forumArea;
      
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceForum.getWorkspace());
      
      List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByWorkspaceAndUser(workspaceEntity, userEntity);
      // TODO: This is definitely not the way to do this 
      
      if (workspaceUsers.size() > 0) {
        WorkspaceUserEntity workspaceUser = workspaceUsers.get(0);
        
        userRole = workspaceUser.getWorkspaceUserRole();
        
        if (resourceUserRolePermissionDAO.hasResourcePermissionAccess(
            resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm) ||
            hasEveryonePermission(permission, forumArea) ||
            userEntity.getId().equals(forumArea.getOwner()))
          return true;
      }
    } 

    EnvironmentUser environmentUser = environmentUserDAO.findByUserAndArchived(userEntity, Boolean.FALSE);
    userRole = environmentUser.getRole();
    
    boolean isOwner = userEntity != null ? userEntity.getId().equals(forumArea.getOwner()) : false;
    
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm) ||
        hasEveryonePermission(permission, forumArea) ||
        isOwner;
  }

  @Override
  public boolean hasEveryonePermission(String permission, ContextReference contextReference) {
    ForumArea forumArea = getForumArea(contextReference);
    RoleEntity userRole = getEveryoneRole();
    Permission perm = permissionDAO.findByName(permission);
    
    if (forumArea == null)
      return false;
    
    return resourceUserRolePermissionDAO.hasResourcePermissionAccess(
        resourceRightsController.findResourceRightsById(forumArea.getRights()), userRole, perm);
  }
  
  private ForumArea getForumArea(ContextReference contextReference) {
    if (contextReference instanceof ForumArea)
      return (ForumArea) contextReference;
    
    if (contextReference instanceof ForumMessage)
      return ((ForumMessage) contextReference).getForumArea();
    
    return null;
  }
  
}
