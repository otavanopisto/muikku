package fi.otavanopisto.muikku.plugins.websocket;

public class WebSocketMessageEvent {
  
  public WebSocketMessageEvent(String ticket, Long userEntityId, WebSocketMessage message) {
    this.ticket = ticket;
    this.userEntityId = userEntityId;
    this.message = message;
  }  

  public WebSocketMessage getMessage() {
    return message;
  }
  
  public String getTicket() {
    return ticket;
  }
  
  public Long getUserEntityId() {
    return userEntityId;
  }
  
  private Long userEntityId;
  private String ticket;
  private WebSocketMessage message;
}
