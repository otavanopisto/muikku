package fi.otavanopisto.muikku.plugins.websocket;

public class WebSocketMessage {

  public WebSocketMessage() {
  }
  
  public WebSocketMessage(String eventType, Object data) {
    this.eventType = eventType;
    this.data = data;
  }
  
  public Object getData() {
    return data;
  }

  public void setData(Object data) {
    this.data = data;
  }

  public String getEventType() {
    return eventType;
  }

  public void setEventType(String eventType) {
    this.eventType = eventType;
  }

  private String eventType;
  private Object data;
}
