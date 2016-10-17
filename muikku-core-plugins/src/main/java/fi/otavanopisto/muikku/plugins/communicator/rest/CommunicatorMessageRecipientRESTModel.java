package fi.otavanopisto.muikku.plugins.communicator.rest;

/**
 * REST model for message recipient.
 */
public class CommunicatorMessageRecipientRESTModel {

  public CommunicatorMessageRecipientRESTModel() {
  }
  
  public CommunicatorMessageRecipientRESTModel(Long recipientId, Long communicatorMessageId, Long userId, String firstName, String lastName) {
    this.recipientId = recipientId;
    this.communicatorMessageId = communicatorMessageId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public Long getRecipientId() {
    return recipientId;
  }

  public void setRecipientId(Long recipientId) {
    this.recipientId = recipientId;
  }

  private Long recipientId;
  private Long communicatorMessageId;
  private Long userId;
  private String firstName;
  private String lastName;
}
