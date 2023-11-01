package fi.otavanopisto.muikku.plugins.chat.rest;

public class ChatRoomDeletedRestModel {
  
  public ChatRoomDeletedRestModel() {
  }
  
  public ChatRoomDeletedRestModel(Long roomId) {
    this.roomId = roomId;
  }

  public Long getRoomId() {
    return roomId;
  }

  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  private Long roomId;
  
}
