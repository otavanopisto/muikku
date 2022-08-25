package fi.otavanopisto.muikku.plugins.forum.events;

public class ForumThreadMessageSent {

  public ForumThreadMessageSent() {
  }
  
  public ForumThreadMessageSent(Long threadId, Long posterUserEntityId, String baseUrl) {
    super();
    this.threadId = threadId;
    this.posterUserEntityId = posterUserEntityId;
    this.baseUrl = baseUrl;
  }

  public Long getThreadId() {
    return threadId;
  }

  public Long getPosterUserEntityId() {
    return posterUserEntityId;
  }

  public String getBaseUrl() {
    return baseUrl;
  }

  private Long threadId;
  private Long posterUserEntityId;
  private String baseUrl;
}
