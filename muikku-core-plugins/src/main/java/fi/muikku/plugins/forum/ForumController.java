package fi.muikku.plugins.forum;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.ResourceRightsController;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.dao.WorkspaceForumAreaDAO;
import fi.muikku.plugins.forum.dao.EnvironmentForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumAreaDAO;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.session.SessionController;

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
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private ResourceRightsController resourceRightsController;

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
  public ForumThread createForumThread(@PermitContext ForumArea forumArea, String title, String message) {
    return forumThreadDAO.create(forumArea, title, message, sessionController.getLoggedUserEntity());
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
    return forumThreadDAO.listByForumArea(forumArea);
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_LISTTHREADS)
  public List<ForumThreadReply> listForumThreadReplies(@PermitContext ForumThread forumThread) {
    return forumThreadReplyDAO.listByForumThread(forumThread);
  }
}
