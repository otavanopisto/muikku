package fi.muikku.plugins.websocket;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class WebSocketPingHandler {
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  public void handlePing(@Observes @MuikkuWebSocketEvent("ping:ping") WebSocketMessageEvent event) {
    webSocketMessenger.sendMessage("ping:pong", event.getMessage().getData(), event.getTicket());
  }
}