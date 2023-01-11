package fi.otavanopisto.muikku.plugins.websocket;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.online.OnlineUsersController;

public class WebSocketPingHandler {
  
  @Inject
  private OnlineUsersController onlineUsersController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  public void handlePing(@Observes @MuikkuWebSocketEvent("ping:ping") WebSocketMessageEvent event) {
    onlineUsersController.checkin(event.getUserEntityId());
    webSocketMessenger.sendMessage("ping:pong", event.getMessage().getData(), event.getTicket());
  }
}