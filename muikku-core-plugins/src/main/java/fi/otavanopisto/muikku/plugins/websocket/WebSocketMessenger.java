package fi.otavanopisto.muikku.plugins.websocket;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.websocket.CloseReason;
import javax.websocket.Session;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;

@ApplicationScoped
@Transactional
public class WebSocketMessenger {
  
  @Inject
  private Logger logger;

  @Inject
  private Event<WebSocketMessageEvent> webSocketMessageEvent;

  @Inject
  private WebSocketTicketController webSocketTicketController;

  private Map<String, Session> sessions;
  
  @PostConstruct
  public void init() {
    sessions = new ConcurrentHashMap<>();
  }

  public void sendMessage(String eventType, Object data, Collection<UserEntity> recipients) {
    Set<Long> recipientIds = recipients.stream().map(UserEntity::getId).collect(Collectors.toSet());
    sendMessageByIds(eventType, data, recipientIds);
  }
  
  public void sendMessageByIds(String eventType, Object data, Collection<Long> recipientIds) {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    ObjectMapper mapper = new ObjectMapper();
    String strMessage = null;
    try {
      strMessage = mapper.writeValueAsString(message);
    }
    catch (Exception e) {
      logger.warning("Unable to serialize websocket message");
      return;
    }

    for (String ticket : sessions.keySet()) {
      Session session = sessions.get(ticket);
      try {
        if (session == null || !session.isOpen()) {
          closeSession(session, ticket, null);
          continue;
        }
        Long userId = (Long) session.getUserProperties().get("UserId");
        if (userId != null && recipientIds.contains(userId)) {
          session.getBasicRemote().sendText(strMessage);
        }
      }
      catch (Exception e) {
        logger.log(Level.WARNING, String.format("Unable to send websocket message: %s", e.getMessage()));
        closeSession(session, ticket, null);
      }
    }
  }
  
  public void sendMessage(String eventType, Object data, String ticket) {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    ObjectMapper mapper = new ObjectMapper();
    String strMessage = null;
    try {
      strMessage = mapper.writeValueAsString(message);
    }
    catch (Exception e) {
      logger.warning("Unable to serialize websocket message");
      return;
    }
    
    Session session = sessions.get(ticket);
    try {
      if (session == null || !session.isOpen()) {
        closeSession(session, ticket, null);
      }
      else {
        session.getBasicRemote().sendText(strMessage);
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, String.format("Unable to send websocket message: %s", e.getMessage()));
      closeSession(session, ticket, null);
    }
  }
  
  public void openSession(Session session, String ticketId) {
    try {
      WebSocketTicket ticket = webSocketTicketController.findTicket(ticketId);
      if (ticket != null) {
        session.getUserProperties().put("UserId", ticket.getUser());
        sessions.put(ticketId, session);
      }
      else {
        CloseReason reason = new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid ticket");
        closeSession(session, ticketId, reason);
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Failed to open WebSocket session", e);
    }
  }

  public void closeSession(Session session, String ticket, CloseReason closeReason) {
    // In normal cases the session is already closed (by client) but should it still
    // be open for any reason, make a silent last-ditch effort to close it gracefully 
    if (session != null && session.isOpen()) {
      try {
        if (closeReason != null) {
          session.close(closeReason);
        }
        else {
          session.close();
        }
      }
      catch (Exception e) {
        // Closing failed, at least we tried...
      }
    }
    // Remove session and its corresponding ticket
    sessions.remove(ticket);
    webSocketTicketController.removeTicket(ticket);
  }

  public void handleMessage(String message, Session session, String ticketId) {
    ObjectMapper mapper = new ObjectMapper();
    try {
      WebSocketTicket ticket = webSocketTicketController.findTicket(ticketId);
      if (ticket != null) {
        WebSocketMessage messageData = mapper.readValue(message, WebSocketMessage.class);
        WebSocketMessageEvent event = new WebSocketMessageEvent(ticket.getTicket(), ticket.getUser(), messageData);
        webSocketMessageEvent.select(new MuikkuWebSocketEventLiteral(messageData.getEventType())).fire(event);
      }
      else {
        CloseReason reason = new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid ticket");
        closeSession(session, ticketId, reason);
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Failed to handle WebSocket message", e);
    }
  }
  
}
