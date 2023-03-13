package fi.otavanopisto.muikku.plugins.websocket;

import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint ("/ws/socket/{TICKET}")
public class WebSocket {
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @OnOpen
  public void onOpen(final Session client, EndpointConfig endpointConfig, @PathParam("TICKET") String ticket) {
    webSocketMessenger.openSession(client, ticket);
  }
  
  @OnClose
  public void onClose(final Session session, CloseReason closeReason, @PathParam("TICKET") String ticket) {
    webSocketMessenger.discardSession(session, ticket, closeReason);
  }

  @OnMessage
  public void onMessage(String message, Session session, @PathParam("TICKET") String ticket) {
    webSocketMessenger.handleMessage(message, session, ticket);
  }
  
}