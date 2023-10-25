package fi.otavanopisto.muikku.plugins.chat.rest;

public class PublicMessageRestModel {
  
  public PublicMessageRestModel() {
  }
  
  public PublicMessageRestModel(Long roomId, String message) {
    this.roomId = roomId;
    this.message = message;
  }
  
  public Long getRoomId() {
    return roomId;
  }
  
  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  private Long roomId;
  private String message;

}
