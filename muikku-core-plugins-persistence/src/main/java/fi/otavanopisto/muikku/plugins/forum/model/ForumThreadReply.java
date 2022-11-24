package fi.otavanopisto.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

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

  public Boolean getDeleted() {
    return deleted;
  }

  public void setDeleted(Boolean deleted) {
    this.deleted = deleted;
  }

  @NotNull
  @Column(nullable = false)
  private Boolean deleted;

  @ManyToOne
  private ForumThread thread;
  
  @ManyToOne
  private ForumThreadReply parentReply;

  @Formula("(select count(*) from ForumThreadReply f where f.parentReply_id = id)")
  private Long childReplyCount;
}
