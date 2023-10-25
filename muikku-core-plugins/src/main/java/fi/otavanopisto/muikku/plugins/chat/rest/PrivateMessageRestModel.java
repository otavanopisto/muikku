package fi.otavanopisto.muikku.plugins.chat.rest;

public class PrivateMessageRestModel {
  
  public PrivateMessageRestModel() {
  }
  
  public PrivateMessageRestModel(Long userEntityId, String message) {
    this.userEntityId = userEntityId;
    this.message = message;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  private Long userEntityId;
  private String message;

}
