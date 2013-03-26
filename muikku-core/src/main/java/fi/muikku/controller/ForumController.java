package fi.muikku.controller;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.forum.CourseForumAreaDAO;
import fi.muikku.dao.forum.EnvironmentForumAreaDAO;
import fi.muikku.dao.forum.ForumAreaDAO;
import fi.muikku.dao.forum.ForumThreadDAO;
import fi.muikku.dao.forum.ForumThreadReplyDAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.forum.CourseForumArea;
import fi.muikku.model.forum.EnvironmentForumArea;
import fi.muikku.model.forum.ForumArea;
import fi.muikku.model.forum.ForumThread;
import fi.muikku.model.forum.ForumThreadReply;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;
import fi.muikku.security.forum.ForumResourcePermissionCollection;
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
  private CourseForumAreaDAO courseForumAreaDAO;

  @Inject
  private ForumAreaDAO forumAreaDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;
  
  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;

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
  public EnvironmentForumArea createEnvironmentForumArea(@PermitContext Environment environment, String name, UserEntity creator) {
    return environmentForumAreaDAO.create(environment, name, false);
  }
  
  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThread createForumThread(@PermitContext ForumArea forumArea, String title, String message) {
    return forumThreadDAO.create(forumArea, title, message, sessionController.getUser());
  }

  @Permit (ForumResourcePermissionCollection.FORUM_WRITEAREA)
  public ForumThreadReply createForumThreadReply(@PermitContext ForumThread thread, String message) {
    return forumThreadReplyDAO.create(thread.getForumArea(), thread, message, sessionController.getUser());
  }

  public List<EnvironmentForumArea> listEnvironmentForums(Environment environment) {
    return sessionController.filterResources(
        environmentForumAreaDAO.listByEnvironment(environment), ForumResourcePermissionCollection.FORUM_WRITEAREA);
  }

  public List<CourseForumArea> listCourseForums(CourseEntity course) {
    return sessionController.filterResources(
        courseForumAreaDAO.listByCourse(course), ForumResourcePermissionCollection.FORUM_WRITEAREA);
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
