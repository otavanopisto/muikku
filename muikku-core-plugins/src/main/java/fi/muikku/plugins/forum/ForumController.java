package fi.muikku.plugins.forum;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.controller.ResourceRightsController;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
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
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@Dependent
@Stateful
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
  private ForumAreaGroupDAO forumAreaGroupDAO;
  
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
  public EnvironmentForumArea createEnvironmentForumArea(String name, Long groupId) {
    UserEntity owner = sessionController.getLoggedUserEntity();
    ResourceRights rights = resourceRightsController.create();
    ForumAreaGroup group = groupId != null ? findForumAreaGroup(groupId) : null;
    return environmentForumAreaDAO.create(name, group, false, owner, rights);
  }
  
  public ForumAreaGroup findForumAreaGroup(Long groupId) {
    return forumAreaGroupDAO.findById(groupId);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThread createForumThread(@PermitContext ForumArea forumArea, String title, String message, Boolean sticky, Boolean locked) {
    return forumThreadDAO.create(forumArea, title, message, sessionController.getLoggedUserEntity(), sticky, locked);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThreadReply createForumThreadReply(@PermitContext ForumThread thread, String message) {
    ForumThreadReply reply = forumThreadReplyDAO.create(thread.getForumArea(), thread, message, sessionController.getLoggedUserEntity());
    
    forumThreadDAO.updateThreadUpdated(thread, reply.getCreated());
    
    return reply;
  }

  public List<EnvironmentForumArea> listEnvironmentForums() {
    return sessionController.filterResources(
        environmentForumAreaDAO.listAll(), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  public List<WorkspaceForumArea> listCourseForums() {
    return sessionController.filterResources(
        workspaceForumAreaDAO.listAll(), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  public List<WorkspaceForumArea> listCourseForums(WorkspaceEntity workspace) {
    return sessionController.filterResources(
        workspaceForumAreaDAO.listByWorkspace(workspace), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  @Permit (ForumResourcePermissionCollection.FORUM_LISTTHREADS)
  public List<ForumThread> listForumThreads(@PermitContext ForumArea forumArea, int firstResult, int maxResults) {
    List<ForumThread> threads = forumThreadDAO.listByForumAreaOrdered(forumArea, firstResult, maxResults);
    
    return threads;
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_LISTTHREADS)
  public List<ForumThreadReply> listForumThreadReplies(@PermitContext ForumThread forumThread, Integer firstResult, Integer maxResults) {
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

  public void updateForumThreadReply(ForumThreadReply reply, String title, String message, Boolean sticky, Boolean locked) {
    UserEntity user = sessionController.getLoggedUserEntity();
    forumThreadReplyDAO.update(reply, message, new Date(), user);
  }

  public List<ForumAreaGroup> listForumAreaGroups() {
    return forumAreaGroupDAO.listAll();
  }

  public ForumAreaGroup createForumAreaGroup(String name) {
    return forumAreaGroupDAO.create(name, Boolean.FALSE);
  }

  public List<ForumMessage> listMessagesByWorkspace(WorkspaceEntity workspace) {
    return forumMessageDAO.listByWorkspace(workspace);
  }

  public List<ForumMessage> listByContributingUser(UserEntity userEntity) {
    return forumMessageDAO.listByContributingUser(userEntity);
  }
}
