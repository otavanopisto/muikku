package fi.otavanopisto.muikku.plugins.chat;

public class ChatMessage {

  public ChatMessage() {
  }

  public ChatMessage(Long roomId, String text) {
    this.roomId = roomId;
    this.text = text;
  }
  
  public String getText() {
    return text;
  }
  
  public void setText(String text) {
    this.text = text;
  }
  
  public Long getRoomId() {
    return roomId;
  }
  
  public void setRoomId(Long roomId) {
    this.roomId = roomId;
  }

  private Long roomId;
  private String text;
}
