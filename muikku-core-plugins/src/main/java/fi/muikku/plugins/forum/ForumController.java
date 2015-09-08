package fi.muikku.plugins.forum;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.controller.PermissionController;
import fi.muikku.controller.ResourceRightsController;
import fi.muikku.dao.users.EnvironmentRoleEntityDAO;
import fi.muikku.dao.users.RoleEntityDAO;
import fi.muikku.dao.workspace.WorkspaceRoleEntityDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.plugins.data.DiscoveredPermissionScope;
import fi.muikku.plugins.data.PermissionDiscoveredEvent;
import fi.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumAreaGroupDAO;
import fi.muikku.plugins.forum.dao.ForumMessageDAO;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

@Dependent
@Stateful
public class ForumController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private EnvironmentForumAreaDAO environmentForumAreaDAO;

  @Inject
  private WorkspaceForumAreaDAO workspaceForumAreaDAO;

  @Inject
  private ForumAreaDAO forumAreaDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;
  
  @Inject
  private ForumMessageDAO forumMessageDAO;
  
  @Inject
  private ForumAreaGroupDAO forumAreaGroupDAO;
  
  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private ResourceRightsController resourceRightsController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private ForumResourcePermissionCollection forumResourcePermissionCollection;

  @Inject
  private PermissionController permissionController;
  
  @Inject
  private EnvironmentRoleEntityDAO environmentRoleEntityDAO; 

  @Inject
  private WorkspaceRoleEntityDAO workspaceRoleEntityDAO; 
  
  @Inject
  private RoleEntityDAO roleEntityDAO; 
  

  public ForumArea getForumArea(Long forumAreaId) {
    return forumAreaDAO.findById(forumAreaId);
  }
  
  public ForumThread getForumThread(Long threadId) {
    return forumThreadDAO.findById(threadId);
  }
  
  public ForumThreadReply getForumThreadReply(Long threadReplyId) {
    return forumThreadReplyDAO.findById(threadReplyId);
  }
  
  private void createDefaultForumPermissions(ForumArea area, ResourceRights rights) {
    List<String> permissions = forumResourcePermissionCollection.listPermissions();
    
    for (String permission : permissions) {
      try {
        String permissionScope = forumResourcePermissionCollection.getPermissionScope(permission);
      
        if (ForumResourcePermissionCollection.PERMISSIONSCOPE_FORUM.equals(permissionScope)) {
          EnvironmentRoleArchetype[] environmentRoles = forumResourcePermissionCollection.getDefaultEnvironmentRoles(permission);
          WorkspaceRoleArchetype[] workspaceRoles = area instanceof WorkspaceForumArea ? forumResourcePermissionCollection.getDefaultWorkspaceRoles(permission) : null;
          String[] pseudoRoles = forumResourcePermissionCollection.getDefaultPseudoRoles(permission);
  
          Permission perm = permissionController.findByName(permission);
          List<RoleEntity> roles = new ArrayList<RoleEntity>();
          
          if (pseudoRoles != null) {
            for (String pseudoRole : pseudoRoles) {
              RoleEntity roleEntity = roleEntityDAO.findByName(pseudoRole);
              
              if (roleEntity != null)
                roles.add(roleEntity);
            }
          }
  
          if (environmentRoles != null) {
            for (EnvironmentRoleArchetype envRole : environmentRoles) {
              List<EnvironmentRoleEntity> envRoles = environmentRoleEntityDAO.listByArchetype(envRole);
              roles.addAll(envRoles);
            }
          }
  
          if (workspaceRoles != null) {
            for (WorkspaceRoleArchetype arc : workspaceRoles) {
              List<WorkspaceRoleEntity> wsRoles = workspaceRoleEntityDAO.listByArchetype(arc);
              roles.addAll(wsRoles);
            }
          }
          
          for (RoleEntity role : roles)
            resourceRightsController.addResourceUserRolePermission(rights, role, perm);
        }
      } catch (NoSuchFieldException e) {
        e.printStackTrace();
      }
    }
  }
  
//  @Permit (ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public EnvironmentForumArea createEnvironmentForumArea(String name, Long groupId) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    ForumAreaGroup group = groupId != null ? findForumAreaGroup(groupId) : null;
    EnvironmentForumArea forumArea = environmentForumAreaDAO.create(name, group, false, owner, rights);
    createDefaultForumPermissions(forumArea, rights);
    return forumArea;
  }
  
  public WorkspaceForumArea createWorkspaceForumArea(WorkspaceEntity workspace, String name, Long groupId) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    ForumAreaGroup group = groupId != null ? findForumAreaGroup(groupId) : null;
    WorkspaceForumArea forumArea = workspaceForumAreaDAO.create(workspace, name, group, false, owner, rights);
    createDefaultForumPermissions(forumArea, rights);
    return forumArea;
  }

  public void deleteArea(ForumArea forumArea) {
    forumAreaDAO.delete(forumArea);
  }

  public ForumAreaGroup findForumAreaGroup(Long groupId) {
    return forumAreaGroupDAO.findById(groupId);
  }

//  @Permit (ForumResourcePermissionCollection.FORUM_WRITEMESSAGES)
  public ForumThread createForumThread(/** @PermitContext **/ ForumArea forumArea, String title, String message, Boolean sticky, Boolean locked) {
    return forumThreadDAO.create(forumArea, title, message, sessionController.getLoggedUserEntity(), sticky, locked);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_DELETEMESSAGES)
  public void deleteThread(@PermitContext ForumThread thread) {
    List<ForumThreadReply> replies = forumThreadReplyDAO.listByForumThread(thread);
    for (ForumThreadReply reply : replies) {
      forumThreadReplyDAO.delete(reply);
    }
    
    forumThreadDAO.delete(thread);
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_WRITEMESSAGES)
  public ForumThreadReply createForumThreadReply(@PermitContext ForumThread thread, String message) {
    if (thread.getLocked()) {
      logger.severe("Tried to create a forum thread reply for locked thread");
      return null;
    } else {
      ForumThreadReply reply = forumThreadReplyDAO.create(thread.getForumArea(), thread, message, sessionController.getLoggedUserEntity());
      forumThreadDAO.updateThreadUpdated(thread, reply.getCreated());
      return reply;
    }
  }

  @Permit (ForumResourcePermissionCollection.FORUM_DELETEMESSAGES)
  public void deleteReply(@PermitContext ForumThreadReply reply) {
    forumThreadReplyDAO.delete(reply);
  }
  
  public List<EnvironmentForumArea> listEnvironmentForums() {
    return sessionController.filterResources(
        environmentForumAreaDAO.listAll(), ForumResourcePermissionCollection.FORUM_LISTFORUM);
  }

  public List<WorkspaceForumArea> listCourseForums() {
    return sessionController.filterResources(
        workspaceForumAreaDAO.listAll(), ForumResourcePermissionCollection.FORUM_LISTWORKSPACEFORUM);
  }

  public List<WorkspaceForumArea> listCourseForums(WorkspaceEntity workspace) {
    return sessionController.filterResources(
        workspaceForumAreaDAO.listByWorkspace(workspace), ForumResourcePermissionCollection.FORUM_LISTWORKSPACEFORUM);
  }

//  @Permit (ForumResourcePermissionCollection.FORUM_READMESSAGES)
  public List<ForumThread> listForumThreads(/**@PermitContext **/ForumArea forumArea, int firstResult, int maxResults) {
    List<ForumThread> threads = forumThreadDAO.listByForumAreaOrdered(forumArea, firstResult, maxResults);
    
    return threads;
  }
  
  public List<ForumThreadReply> listForumThreadReplies(ForumThread forumThread, Integer firstResult, Integer maxResults) {
    return forumThreadReplyDAO.listByForumThread(forumThread, firstResult, maxResults);
  }
  
  public List<ForumThread> listLatestForumThreads(int firstResult, int maxResults) {
    List<EnvironmentForumArea> environmentForums = listEnvironmentForums();
    List<WorkspaceForumArea> workspaceForums = listCourseForums();
    List<ForumArea> forumAreas = new ArrayList<ForumArea>();

    // TODO: This could use some optimization
    
    for (EnvironmentForumArea ef : environmentForums) {
      forumAreas.add(ef);
    }
    
    for (WorkspaceForumArea wf : workspaceForums) {
      forumAreas.add(wf);
    }
    
    List<ForumThread> threads;
    
    if (!forumAreas.isEmpty())
      threads = forumThreadDAO.listLatestOrdered(forumAreas, firstResult, maxResults);
    else
      threads = new ArrayList<ForumThread>();
    
    return threads;
  }
  
  public List<ForumThread> listLatestForumThreadsFromWorkspace(WorkspaceEntity workspaceEntity, Integer firstResult,
      Integer maxResults) {
    List<WorkspaceForumArea> workspaceForums = listCourseForums(workspaceEntity);
    List<ForumArea> forumAreas = new ArrayList<ForumArea>();

    // TODO: This could use some optimization
    for (WorkspaceForumArea wf : workspaceForums) {
      forumAreas.add(wf);
    }
    
    List<ForumThread> threads;

    if (!forumAreas.isEmpty())
      threads = forumThreadDAO.listLatestOrdered(forumAreas, firstResult, maxResults);
    else
      threads = new ArrayList<ForumThread>();

    return threads;
  }

  public UserEntity findUserEntity(Long userEntityId) {
    return userEntityController.findUserEntityById(userEntityId);
  }
  
  public User findUser(UserEntity userEntity) {
    return userController.findUserByUserEntityDefaults(userEntity);
  }
  
  public boolean getUserHasPicture(UserEntity userEntity) {
    return false; // TODO
  }
  
  public ForumThreadReply getLatestReply(ForumThread thread) {
    return forumThreadReplyDAO.findLatestReplyByThread(thread);
  }
  
  public ForumMessage getLatestMessage(ForumArea area) {
    return forumMessageDAO.findLatestMessageByArea(area);
  }
  
  public Long getThreadReplyCount(ForumThread thread) {
    return forumThreadReplyDAO.countByThread(thread);
  }

  public Long getThreadCount(ForumArea area) {
    return forumThreadDAO.countByArea(area);
  }

  public Long getMessageCount(ForumArea area) {
    return forumMessageDAO.countByArea(area);
  }
  
  public void archiveMessage(ForumMessage message) {
    forumMessageDAO.archive(message);
    
    if (message instanceof ForumThreadReply) {
      ForumThreadReply reply = (ForumThreadReply) message;
      
      ForumThreadReply latestReply = getLatestReply(reply.getThread());
      
      if (latestReply != null)
        forumThreadDAO.updateThreadUpdated(reply.getThread(), latestReply.getCreated());
      else
        forumThreadDAO.updateThreadUpdated(reply.getThread(), reply.getThread().getCreated());
    }
  }
  
  public void updateForumThread(ForumThread thread, String title, String message, Boolean sticky, Boolean locked) {
    UserEntity user = sessionController.getLoggedUserEntity();
    forumThreadDAO.update(thread, title, message, sticky, locked, new Date(), user);
  }

  public void updateForumThreadReply(ForumThreadReply reply, String message) {
    UserEntity user = sessionController.getLoggedUserEntity();
    forumThreadReplyDAO.update(reply, message, new Date(), user);
  }

  public List<ForumAreaGroup> listForumAreaGroups() {
    return forumAreaGroupDAO.listAll();
  }

  public ForumAreaGroup createForumAreaGroup(String name) {
    return forumAreaGroupDAO.create(name, Boolean.FALSE);
  }

  public void deleteAreaGroup(ForumAreaGroup forumAreaGroup) {
    forumAreaGroupDAO.delete(forumAreaGroup);
  }
  
  public List<ForumMessage> listMessagesByWorkspace(WorkspaceEntity workspace) {
    return forumMessageDAO.listByWorkspace(workspace);
  }

  public List<ForumMessage> listByContributingUser(UserEntity userEntity) {
    return forumMessageDAO.listByContributingUser(userEntity);
  }
  
  public void permissionDiscoveredListener(@Observes @DiscoveredPermissionScope("FORUM") PermissionDiscoveredEvent event) {
    Permission permission = event.getPermission();
    String permissionName = permission.getName();

    List<ForumArea> forumAreas = forumAreaDAO.listAll();
    
    for (ForumArea area : forumAreas) {
      try {
        String permissionScope = permission.getScope();
      
        if (ForumResourcePermissionCollection.PERMISSIONSCOPE_FORUM.equals(permissionScope)) {
          ResourceRights rights = resourceRightsController.findResourceRightsById(area.getRights());
          EnvironmentRoleArchetype[] environmentRoles = forumResourcePermissionCollection.getDefaultEnvironmentRoles(permissionName);
          WorkspaceRoleArchetype[] workspaceRoles = area instanceof WorkspaceForumArea ? forumResourcePermissionCollection.getDefaultWorkspaceRoles(permissionName) : null;
          String[] pseudoRoles = forumResourcePermissionCollection.getDefaultPseudoRoles(permissionName);
  
          List<RoleEntity> roles = new ArrayList<RoleEntity>();
          
          if (pseudoRoles != null) {
            for (String pseudoRole : pseudoRoles) {
              RoleEntity roleEntity = roleEntityDAO.findByName(pseudoRole);
              
              if (roleEntity != null)
                roles.add(roleEntity);
            }
          }
  
          if (environmentRoles != null) {
            for (EnvironmentRoleArchetype envRole : environmentRoles) {
              List<EnvironmentRoleEntity> envRoles = environmentRoleEntityDAO.listByArchetype(envRole);
              roles.addAll(envRoles);
            }
          }
  
          if (workspaceRoles != null) {
            for (WorkspaceRoleArchetype arc : workspaceRoles) {
              List<WorkspaceRoleEntity> wsRoles = workspaceRoleEntityDAO.listByArchetype(arc);
              roles.addAll(wsRoles);
            }
          }
          
          for (RoleEntity role : roles)
            resourceRightsController.addResourceUserRolePermission(rights, role, permission);
        }
      } catch (NoSuchFieldException e) {
        e.printStackTrace();
      }
    }
  }

}
