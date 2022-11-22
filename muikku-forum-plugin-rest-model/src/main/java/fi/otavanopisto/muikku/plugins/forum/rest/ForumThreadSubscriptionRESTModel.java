package fi.otavanopisto.muikku.plugins.forum.rest;

public class ForumThreadSubscriptionRESTModel {

  public ForumThreadSubscriptionRESTModel() {
  }
  
  public ForumThreadSubscriptionRESTModel(Long id, Long threadId, Long userEntityId, ForumThreadRESTModel thread, Long workspaceId, String workspaceUrlName, String workspaceName) {
    super();
    this.setThreadId(threadId);
    this.setUserEntityId(userEntityId);
    this.setThread(thread);
    this.setWorkspaceId(workspaceId);
    this.setWorkspaceUrlName(workspaceUrlName);
    this.setWorkspaceName(workspaceName);
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

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  private Long threadId;
  private Long userEntityId;
  private ForumThreadRESTModel thread;
  private Long workspaceId;
  private String workspaceUrlName;
  private String workspaceName;
}
