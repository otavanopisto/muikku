package fi.otavanopisto.muikku.plugins.communicator.rest;

/**
 * REST model for message recipient.
 */
@Deprecated
public class CommunicatorMessageRecipientRESTModel {

  public CommunicatorMessageRecipientRESTModel() {
  }
  
  public CommunicatorMessageRecipientRESTModel(Long recipientId, Long communicatorMessageId, Long userEntityId, String firstName, String lastName, String nickName, boolean archived) {
    this.recipientId = recipientId;
    this.communicatorMessageId = communicatorMessageId;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.archived = archived;
    this.nickName = nickName;
  }

  public Long getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(Long communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
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

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public boolean isArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }
  
  private Long recipientId;
  private Long communicatorMessageId;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean archived;
}
