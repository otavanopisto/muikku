package fi.otavanopisto.muikku.plugins.chat.rest;

public class RoomLeftRestModel {
  
  public RoomLeftRestModel() {
  }
  
  public RoomLeftRestModel(Long roomId, Long userEntityId) {
    this.roomId = roomId;
    this.userEntityId = userEntityId;
  }

  public Long getRoomId() {
    return roomId;
  }
  
  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  private Long roomId;
  private Long userEntityId;
}
