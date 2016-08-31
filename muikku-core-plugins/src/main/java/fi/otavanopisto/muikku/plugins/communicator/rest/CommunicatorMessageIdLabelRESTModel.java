package fi.otavanopisto.muikku.plugins.communicator.rest;


public class CommunicatorMessageIdLabelRESTModel {

  public CommunicatorMessageIdLabelRESTModel() {
  }
  
  public CommunicatorMessageIdLabelRESTModel(Long id, Long userEntityId, Long messageThreadId, Long labelId, String labelName, Long labelColor) {
    this.id = id;
    this.userEntityId = userEntityId;
    this.messageThreadId = messageThreadId;
    this.labelId = labelId;
    this.labelName = labelName;
    this.labelColor = labelColor;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getMessageThreadId() {
    return messageThreadId;
  }

  public void setMessageThreadId(Long messageThreadId) {
    this.messageThreadId = messageThreadId;
  }

  public Long getLabelId() {
    return labelId;
  }

  public void setLabelId(Long labelId) {
    this.labelId = labelId;
  }

  public String getLabelName() {
    return labelName;
  }

  public void setLabelName(String labelName) {
    this.labelName = labelName;
  }

  public Long getLabelColor() {
    return labelColor;
  }

  public void setLabelColor(Long labelColor) {
    this.labelColor = labelColor;
  }

  private Long id;
  private Long userEntityId;
  private Long messageThreadId;
  private Long labelId;
  private String labelName;
  private Long labelColor;
}
