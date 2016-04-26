package fi.otavanopisto.muikku.plugins.forum.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

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

  @ManyToOne
  private ForumThread thread;
  
  @ManyToOne
  private ForumThreadReply parentReply;
}
