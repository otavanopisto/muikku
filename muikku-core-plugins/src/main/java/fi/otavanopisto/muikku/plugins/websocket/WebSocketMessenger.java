package fi.otavanopisto.muikku.plugins.websocket;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.Session;

import org.apache.commons.codec.binary.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;

@ApplicationScoped
@Singleton
public class WebSocketMessenger {
  
  @Inject
  private Logger logger;

  @Inject
  private Event<WebSocketMessageEvent> webSocketMessageEvent;

  @PostConstruct
  public void init() {
    sessions = new ConcurrentHashMap<>();
  }
  
  public WebSocketSessionInfo getSessionInfo(String ticket) {
    return sessions.get(ticket);
  }
  
  public String registerTicket(Long userEntityId) {
    String ticket = UUID.randomUUID().toString();
    while (sessions.containsKey(ticket)) {
      ticket = UUID.randomUUID().toString();
    }
    // Actual web socket session has not yet been opened but in order to validate
    // this ticket in openSession, we register it to the session map 
    sessions.put(ticket, new WebSocketSessionInfo(userEntityId));
    return ticket;
  }
  
  public void sendMessage(String eventType, String data, Set<Long> recipients) {
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
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      try {
        if (sessionInfo == null || sessionInfo.getSession() == null) {
          continue; // session not found or not yet opened, so skip it
        }
        else if (!sessionInfo.getSession().isOpen()) {
          discardSession(sessionInfo.getSession(), ticket, null);
          continue;
        }
        if (sessionInfo.getUserEntityId() != null && recipients.contains(sessionInfo.getUserEntityId())) {
          sessionInfo.getSession().getBasicRemote().sendText(strMessage);
          sessionInfo.access();
        }
      }
      catch (Exception e) {
        logger.log(Level.WARNING, String.format("Unable to send websocket message: %s", e.getMessage()));
        discardSession(sessionInfo.getSession(), ticket, null);
      }
    }
  }
  
  public void sendMessage(String eventType, Object data, List<UserEntity> recipients) {
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

    List<Long> recipientIds = new ArrayList<Long>(recipients.size());
    for (UserEntity userEntity : recipients) {
      recipientIds.add(userEntity.getId());
    }
    
    for (String ticket : sessions.keySet()) {
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      try {
        if (sessionInfo == null || sessionInfo.getSession() == null) {
          continue; // session not found or not yet opened, so skip it
        }
        else if (!sessionInfo.getSession().isOpen()) {
          discardSession(sessionInfo.getSession(), ticket, null);
          continue;
        }
        if (sessionInfo.getUserEntityId() != null && recipientIds.contains(sessionInfo.getUserEntityId())) {
          sessionInfo.getSession().getBasicRemote().sendText(strMessage);
          sessionInfo.access();
        }
      }
      catch (Exception e) {
        logger.log(Level.WARNING, String.format("Unable to send websocket message: %s", e.getMessage()));
        discardSession(sessionInfo.getSession(), ticket, null);
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
    
    WebSocketSessionInfo sessionInfo = sessions.get(ticket);
    try {
      if (sessionInfo == null || sessionInfo.getSession() == null) {
        return; // session not found or not yet opened, so skip it
      }
      else if (!sessionInfo.getSession().isOpen()) {
        discardSession(sessionInfo.getSession(), ticket, null);
      }
      else {
        sessionInfo.getSession().getBasicRemote().sendText(strMessage);
        sessionInfo.access();
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, String.format("Unable to send websocket message: %s", e.getMessage()));
      discardSession(sessionInfo.getSession(), ticket, null);
    }
  }
  
  public void openSession(Session session, String ticket) {
    try {
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      if (sessionInfo != null && sessionInfo.getSession() == null) {
        sessionInfo.setSession(session);
        sessionInfo.access();
      }
      else {
        discardSession(session, ticket, new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid ticket"));
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Failed to open WebSocket session", e);
    }
  }

  public void discardSession(Session session, String ticket, CloseReason closeReason) {
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
  }

  public void handleMessage(String message, Session session, String ticket) {
    ObjectMapper mapper = new ObjectMapper();
    try {
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      if (sessionInfo != null && sessionInfo.getSession() != null && StringUtils.equals(session.getId(), sessionInfo.getSession().getId())) {
        WebSocketMessage messageData = mapper.readValue(message, WebSocketMessage.class);
        WebSocketMessageEvent event = new WebSocketMessageEvent(ticket, sessionInfo.getUserEntityId(), messageData);
        webSocketMessageEvent.select(new MuikkuWebSocketEventLiteral(messageData.getEventType())).fire(event);
        sessionInfo.access();
      }
      else {
        discardSession(session, ticket, new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid ticket"));
      }
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Failed to handle WebSocket message", e);
    }
  }

  @Schedule(hour = "*", persistent = false)
  private void discardExpiredSessions() {
    for (String ticket : sessions.keySet()) {
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      if (sessionInfo.expired()) {
        discardSession(sessionInfo.getSession(), ticket, null);
      }
    }
  }  
  
  private ConcurrentHashMap<String, WebSocketSessionInfo> sessions;
  
}
