package fi.muikku.plugins.forum;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.ResourceRightsController;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.dao.ForumMessageDAO;
import fi.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.ForumMessage;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@RequestScoped
@Stateful
@Named("Forum")
public class ForumController {
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
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private ResourceRightsController resourceRightsController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  public ForumArea getForumArea(Long forumAreaId) {
    return forumAreaDAO.findById(forumAreaId);
  }
  
  public ForumThread getForumThread(Long threadId) {
    return forumThreadDAO.findById(threadId);
  }
  
  public ForumThreadReply getForumThreadReply(Long threadReplyId) {
    return forumThreadReplyDAO.findById(threadReplyId);
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM)
  public EnvironmentForumArea createEnvironmentForumArea(String name) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    return environmentForumAreaDAO.create(name, false, owner, rights);
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThread createForumThread(@PermitContext ForumArea forumArea, String title, String message, Boolean sticky) {
    return forumThreadDAO.create(forumArea, title, message, sessionController.getLoggedUserEntity(), sticky);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThreadReply createForumThreadReply(@PermitContext ForumThread thread, String message) {
    return forumThreadReplyDAO.create(thread.getForumArea(), thread, message, sessionController.getLoggedUserEntity());
  }

  public List<EnvironmentForumArea> listEnvironmentForums() {
    return sessionController.filterResources(
        environmentForumAreaDAO.listAll(), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  public List<WorkspaceForumArea> listCourseForums(WorkspaceEntity workspace) {
    return sessionController.filterResources(
        workspaceForumAreaDAO.listByWorkspace(workspace), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_LISTTHREADS)
  public List<ForumThread> listForumThreads(@PermitContext ForumArea forumArea) {
    List<ForumThread> threads = forumThreadDAO.listByForumArea(forumArea);
    
    Collections.sort(threads, new Comparator<ForumThread>() {
      @Override
      public int compare(ForumThread o1, ForumThread o2) {
        if (o1.getSticky() && !o2.getSticky())
          return -1;
        if (o2.getSticky() && !o1.getSticky())
          return 1;
        
        ForumThreadReply r1 = getLatestReply(o1);
        ForumThreadReply r2 = getLatestReply(o2);
        
        Date d1 = r1 != null ? r1.getCreated() : o1.getCreated();
        Date d2 = r2 != null ? r2.getCreated() : o2.getCreated();
        
        return d1.compareTo(d2);
      }
    });
    
    return threads;
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_LISTTHREADS)
  public List<ForumThreadReply> listForumThreadReplies(@PermitContext ForumThread forumThread) {
    return forumThreadReplyDAO.listByForumThread(forumThread);
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
}
