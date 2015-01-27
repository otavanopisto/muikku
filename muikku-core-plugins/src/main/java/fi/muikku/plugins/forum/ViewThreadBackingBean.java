package fi.muikku.plugins.forum;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;

import fi.muikku.plugins.forum.model.ForumThread;
import fi.muikku.plugins.forum.model.ForumThreadReply;

@Named
@Stateful
@RequestScoped
@Join (path = "/forum/t/{threadId}", to = "/forum/viewthread.jsf")
public class ViewThreadBackingBean {
  
  @Parameter
  private Long threadId;

  @Inject
  private ForumController forumController;
  
  public ForumThread getForumThread() {
    return forumController.getForumThread(threadId);
  }

  public List<ForumThreadReply> listForumThreadReplies() {
    return forumController.listForumThreadReplies(getForumThread(), 0, 25);
  }

  public Long getThreadId() {
    return threadId;
  }

  public void setThreadId(Long threadId) {
    this.threadId = threadId;
  }
}
