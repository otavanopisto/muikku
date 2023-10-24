package fi.otavanopisto.muikku.plugins.chat.rest;

public class RoomJoinedRestModel {
  
  public RoomJoinedRestModel() {
  }
  
  public RoomJoinedRestModel(Long roomId, Long userId, String nick) {
    this.roomId = roomId;
    this.userId = userId;
    this.nick = nick;
  }
  
  public Long getRoomId() {
    return roomId;
  }
  
  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }
  
  public Long getUserId() {
    return userId;
  }
  
  public void setUserId(Long userId) {
    this.userId = userId;
  }
  
  public String getNick() {
    return nick;
  }
  
  public void setNick(String nick) {
    this.nick = nick;
  }
  
  private Long roomId;
  private Long userId;
  private String nick;

}
