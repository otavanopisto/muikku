package fi.otavanopisto.muikku.plugins.forum.events;

public class ForumMessageSent {

  public ForumMessageSent() {
  }
  
  public ForumMessageSent(Long areaId, Long threadId, Long replyId, Long posterUserEntityId, String baseUrl, String workspaceUrlName) {
    super();
    this.areaId = areaId;
    this.threadId = threadId;
    this.replyId = replyId;
    this.posterUserEntityId = posterUserEntityId;
    this.baseUrl = baseUrl;
    this.workspaceUrlName = workspaceUrlName;
  }

  public Long getAreaId() {
    return areaId;
  }

  public void setAreaId(Long areaId) {
    this.areaId = areaId;
  }

  public Long getThreadId() {
    return threadId;
  }

  public Long getReplyId() {
    return replyId;
  }

  public Long getPosterUserEntityId() {
    return posterUserEntityId;
  }

  public String getBaseUrl() {
    return baseUrl;
  }

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  private Long areaId;
  private Long threadId;
  private Long replyId;
  private Long posterUserEntityId;
  private String baseUrl;
  private String workspaceUrlName;
}
