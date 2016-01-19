package fi.muikku.plugins.websocket;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint ("/ws/socket/{TICKET}")
@Transactional
public class WebSocket {
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @OnOpen
  public void onOpen(final Session client, EndpointConfig endpointConfig, @PathParam("TICKET") String ticket) {
    webSocketMessenger.openSession(client, ticket);
  }
  
  @OnClose
  public void onClose(final Session session, CloseReason closeReason, @PathParam("TICKET") String ticket) {
    webSocketMessenger.closeSession(session, ticket);
  }

  @OnMessage
  public void onMessage(String message, Session session, @PathParam("TICKET") String ticket) {
    webSocketMessenger.handleMessage(message, session, ticket);
  }
  
}