package fi.muikku.plugins.websocket;

import java.io.IOException;

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


@ServerEndpoint ("/ws/socket")
@Transactional
public class WebSocket {
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @OnOpen
  public void onOpen(final Session client, EndpointConfig endpointConfig) throws IOException {
    webSocketMessenger.openSession(client);
  }
  
  @OnClose
  public void onClose(final Session session, CloseReason closeReason, @PathParam("HTMLMATERIALID") String fileId, @PathParam("SESSIONID") String sessionId) {
    webSocketMessenger.closeSession(session);
  }

  @OnMessage
  public void onMessage(String message, Session session) throws IOException {
    webSocketMessenger.handleMessage(message, session);
  }
  
}