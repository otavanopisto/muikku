package fi.otavanopisto.muikku.plugins.forum.events;

public class ForumThreadMessageSent {

  public ForumThreadMessageSent() {
  }
  
  public ForumThreadMessageSent(Long threadId, Long recipientUserEntityId, String baseUrl) {
    super();
    this.threadId = threadId;
    this.recipientUserEntityId = recipientUserEntityId;
    this.baseUrl = baseUrl;
  }

  public Long getThreadId() {
    return threadId;
  }

  public Long getRecipientUserEntityId() {
    return recipientUserEntityId;
  }

  public String getBaseUrl() {
    return baseUrl;
  }

  private Long threadId;
  private Long recipientUserEntityId;
  private String baseUrl;
}
