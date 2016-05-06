package fi.otavanopisto.muikku.plugins.forum.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import org.hibernate.annotations.Formula;

import fi.otavanopisto.security.ContextReference;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ForumThreadReply extends ForumMessage implements ContextReference {

  public ForumThread getThread() {
    return thread;
  }

  public void setThread(ForumThread thread) {
    this.thread = thread;
  }

  public ForumThreadReply getParentReply() {
    return parentReply;
  }

  public void setParentReply(ForumThreadReply parentReply) {
    this.parentReply = parentReply;
  }

  public Long getChildReplyCount() {
    return childReplyCount;
  }

  @ManyToOne
  private ForumThread thread;
  
  @ManyToOne
  private ForumThreadReply parentReply;

  @Formula("(select count(*) from forumthreadreply f where f.parentReply_id = id)")
  private Long childReplyCount;
}
