package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorMessageRecipientRESTModel {

  public CommunicatorMessageRecipientRESTModel() {
    
  }
  
  public CommunicatorMessageRecipientRESTModel(Long id, Long communicatorMessageId, Long recipientId) {
    this.id = id;
    this.communicatorMessageId = communicatorMessageId;
    this.recipientId = recipientId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public Long getRecipientId() {
    return recipientId;
  }

  public void setRecipientId(Long recipientId) {
    this.recipientId = recipientId;
  }

  private Long id;

  private Long communicatorMessageId;

  private Long recipientId;
}
