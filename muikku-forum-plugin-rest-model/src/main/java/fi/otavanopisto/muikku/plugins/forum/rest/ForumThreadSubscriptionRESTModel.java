package fi.otavanopisto.muikku.plugins.forum.rest;

public class ForumThreadSubscriptionRESTModel {

  public ForumThreadSubscriptionRESTModel() {
  }
  
  public ForumThreadSubscriptionRESTModel(Long id, Long threadId, Long userEntityId, ForumThreadRESTModel thread) {
    super();
    this.setThreadId(threadId);
    this.setUserEntityId(userEntityId);
    this.setThread(thread);
  }

  public Long getThreadId() {
    return threadId;
  }

  public void setThreadId(Long threadId) {
    this.threadId = threadId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public ForumThreadRESTModel getThread() {
    return thread;
  }

  public void setThread(ForumThreadRESTModel thread) {
    this.thread = thread;
  }

  private Long threadId;
  private Long userEntityId;
  private ForumThreadRESTModel thread;
}
