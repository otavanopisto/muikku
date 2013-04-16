package fi.muikku.plugins.forum.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ForumThreadReply extends ForumMessage {

  public ForumThread getThread() {
    return thread;
  }

  public void setThread(ForumThread thread) {
    this.thread = thread;
  }

  @ManyToOne
  private ForumThread thread;
}
