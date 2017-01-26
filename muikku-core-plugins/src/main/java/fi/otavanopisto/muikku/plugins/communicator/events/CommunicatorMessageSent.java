package fi.otavanopisto.muikku.plugins.communicator.events;

public class CommunicatorMessageSent {

  public CommunicatorMessageSent() {
  }
  
  public CommunicatorMessageSent(Long communicatorMessageId, Long recipientUserEntityId, String baseUrl) {
    super();
    this.communicatorMessageId = communicatorMessageId;
    this.recipientUserEntityId = recipientUserEntityId;
    this.baseUrl = baseUrl;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public Long getRecipientUserEntityId() {
    return recipientUserEntityId;
  }

  public String getBaseUrl() {
    return baseUrl;
  }

  private Long communicatorMessageId;
  private Long recipientUserEntityId;
  private String baseUrl;
}
