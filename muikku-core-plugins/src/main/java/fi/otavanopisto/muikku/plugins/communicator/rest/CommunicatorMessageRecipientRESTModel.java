package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorMessageRecipientRESTModel {

  public CommunicatorMessageRecipientRESTModel() {
  }
  
  public CommunicatorMessageRecipientRESTModel(Long id, Long communicatorMessageId, Long userId, String firstName, String lastName) {
    this.id = id;
    this.communicatorMessageId = communicatorMessageId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
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

  private Long id;
  private Long communicatorMessageId;
  private Long userId;
  private String firstName;
  private String lastName;
}
