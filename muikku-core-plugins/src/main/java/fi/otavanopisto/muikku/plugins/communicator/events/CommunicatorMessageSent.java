package fi.otavanopisto.muikku.plugins.communicator.events;

public class CommunicatorMessageSent {

  public CommunicatorMessageSent() {
  }
  
  public CommunicatorMessageSent(Long communicatorMessageId, Long recipientUserEntityId) {
    super();
    this.communicatorMessageId = communicatorMessageId;
    this.recipientUserEntityId = recipientUserEntityId;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public Long getRecipientUserEntityId() {
    return recipientUserEntityId;
  }

  private Long communicatorMessageId;
  private Long recipientUserEntityId;
}
