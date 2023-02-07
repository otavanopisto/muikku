package fi.otavanopisto.muikku.atests;

public class DiscussionThreadReply {

  public DiscussionThreadReply() {
  }
  
  public DiscussionThreadReply(Long id, Long threadId, String message, Boolean deleted, DiscussionThreadReply parentReply) {
    this.id = id;
    this.setThreadId(threadId);
    this.setMessage(message);
    this.setDeleted(deleted);
    this.parentReply = parentReply;
  }
    
  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public DiscussionThreadReply getParentReply() {
    return parentReply;
  }

  public void setParentReply(DiscussionThreadReply parentReply) {
    this.parentReply = parentReply;
  }

  public Boolean getDeleted() {
    return deleted;
  }

  public void setDeleted(Boolean deleted) {
    this.deleted = deleted;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getThreadId() {
    return threadId;
  }

  public void setThreadId(Long threadId) {
    this.threadId = threadId;
  }

  private Long id;
  private Long threadId;
  private String message;
  private Boolean deleted;
  private DiscussionThreadReply parentReply;

}