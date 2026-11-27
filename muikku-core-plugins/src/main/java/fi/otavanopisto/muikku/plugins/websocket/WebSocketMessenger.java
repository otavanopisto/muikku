package fi.otavanopisto.muikku.plugins.websocket;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.Session;

import org.apache.commons.codec.binary.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import fi.otavanopisto.muikku.model.users.UserEntity;

@Singleton
@Lock(LockType.READ)
public class WebSocketMessenger {
  
  @Inject
  private Logger logger;

  @Inject
  private Event<WebSocketMessageEvent> webSocketMessageEvent;
  
  // JavaTimeModule required to serialize Java 8 LocalDate
  private final ObjectMapper objectMapper = new ObjectMapper().configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false).registerModule(new JavaTimeModule());
  
  private final ConcurrentHashMap<String, WebSocketSessionInfo> sessions = new ConcurrentHashMap<>();

  public WebSocketSessionInfo getSessionInfo(String ticket) {
    return sessions.get(ticket);
  }
  
  public String registerTicket(Long userEntityId) {
    // Actual web socket session has not yet been opened but in order to validate
    // this ticket in openSession, we register it to the session map 
    String ticket;
    do {
      ticket = UUID.randomUUID().toString();
    }
    while (sessions.putIfAbsent(ticket, new WebSocketSessionInfo(userEntityId)) != null);
    return ticket;
  }
  
  public void sendMessage(String eventType, Object data, Set<Long> recipients) {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    String strMessage = null;
    try {
      strMessage = objectMapper.writeValueAsString(message);
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Serialization failure", e);
      return;
    }
    for (Map.Entry<String, WebSocketSessionInfo> entry : sessions.entrySet()) {
      String ticket = entry.getKey();
      WebSocketSessionInfo sessionInfo = entry.getValue();
      try {
        if (sessionInfo == null || sessionInfo.getSession() == null) {
          continue; // session not found or not yet opened, so skip it
        }
        else if (!sessionInfo.getSession().isOpen()) {
          discardSession(sessionInfo.getSession(), ticket, null);
          continue;
        }
        if (sessionInfo.getUserEntityId() != null && recipients.contains(sessionInfo.getUserEntityId())) {
          sessionInfo.getSession().getAsyncRemote().sendText(strMessage, result -> {
            if (!result.isOK()) {
              handleSendFailure(sessionInfo, ticket, result.getException());
            }
            else {
              sessionInfo.access();
            }
          });
        }
      }
      catch (Exception e) {
        handleSendFailure(sessionInfo, ticket, e);
      }
    }
  }
  
  public void sendMessage(String eventType, Object data, List<UserEntity> recipients) {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    String strMessage = null;
    try {
      strMessage = objectMapper.writeValueAsString(message);
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Serialization failure", e);
      return;
    }

    Set<Long> recipientIds = recipients.stream().map(UserEntity::getId).collect(Collectors.toSet());
    
    for (Map.Entry<String, WebSocketSessionInfo> entry : sessions.entrySet()) {
      String ticket = entry.getKey();
      WebSocketSessionInfo sessionInfo = entry.getValue();
      try {
        if (sessionInfo == null || sessionInfo.getSession() == null) {
          continue; // session not found or not yet opened, so skip it
        }
        else if (!sessionInfo.getSession().isOpen()) {
          discardSession(sessionInfo.getSession(), ticket, null);
          continue;
        }
        if (sessionInfo.getUserEntityId() != null && recipientIds.contains(sessionInfo.getUserEntityId())) {
          sessionInfo.getSession().getAsyncRemote().sendText(strMessage, result -> {
            if (!result.isOK()) {
              handleSendFailure(sessionInfo, ticket, result.getException());
            }
            else {
              sessionInfo.access();
            }
          });
        }
      }
      catch (Exception e) {
        handleSendFailure(sessionInfo, ticket, e);
      }
    }
  }
  
  public void sendMessage(String eventType, Object data, String ticket) {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    String strMessage = null;
    try {
      strMessage = objectMapper.writeValueAsString(message);
    }
    catch (Exception e) {
      logger.log(Level.WARNING, "Serialization failure", e);
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
        sessionInfo.getSession().getAsyncRemote().sendText(strMessage, result -> {
          if (!result.isOK()) {
            handleSendFailure(sessionInfo, ticket, result.getException());
          }
          else {
            sessionInfo.access();
          }
        });
      }
    }
    catch (Exception e) {
      handleSendFailure(sessionInfo, ticket, e);
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
    try {
      WebSocketSessionInfo sessionInfo = sessions.get(ticket);
      if (sessionInfo != null && sessionInfo.getSession() != null && StringUtils.equals(session.getId(), sessionInfo.getSession().getId())) {
        WebSocketMessage messageData = objectMapper.readValue(message, WebSocketMessage.class);
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

  @Schedule(hour = "*", minute = "*/5", persistent = false)
  public void discardExpiredSessions() {
    for (Map.Entry<String, WebSocketSessionInfo> entry : sessions.entrySet()) {
      String ticket = entry.getKey();
      WebSocketSessionInfo sessionInfo = entry.getValue();
      if (sessionInfo.expired()) {
        discardSession(sessionInfo.getSession(), ticket, null);
      }
    }
  }
  
  private void handleSendFailure(WebSocketSessionInfo sessionInfo, String ticket, Throwable cause) {
    if (cause != null && cause instanceof IllegalStateException) {
      logger.log(Level.WARNING, "Send failure", cause);
    }
    else {
      logger.log(Level.WARNING, "Session failure", cause);
      discardSession(sessionInfo.getSession(), ticket, null);
    }
  }
  
}
