package fi.otavanopisto.muikku.plugins.websocket;

import java.nio.channels.ClosedChannelException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.Session;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketTicket;

@ApplicationScoped
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
    sessions = new HashMap<>();
  }
  
  public void sendMessage(String eventType, Object data, List<UserEntity> recipients) {
    try {
      List<Long> recipientIds = new ArrayList<Long>(recipients.size());
      for (UserEntity userEntity : recipients) {
        recipientIds.add(userEntity.getId());
      }
      
      WebSocketMessage message = new WebSocketMessage(eventType, data);
      ObjectMapper mapper = new ObjectMapper();
      String strMessage = mapper.writeValueAsString(message);
      
      for (Session session : new ArrayList<>(sessions.values())) {
        if (session.isOpen()) {
          Long userId = (Long) session.getUserProperties().get("UserId");
  
          if ((userId != null) && (recipientIds.contains(userId))) {
            session.getBasicRemote().sendText(strMessage);
          }
        }
      }    
    }
    catch (ClosedChannelException cce) {
      // Channel already closed; ignore
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to send WebSocket message", e);
    }
  }
  
  public void sendMessage(String eventType, Object data, String ticket) {
    try {
      WebSocketMessage message = new WebSocketMessage(eventType, data);
      ObjectMapper mapper = new ObjectMapper();
      String strMessage = mapper.writeValueAsString(message);
      Session session = sessions.get(ticket);
      if (session == null){
        logger.log(Level.SEVERE, "Session doesn't exist");
      }
      else{
        session.getBasicRemote().sendText(strMessage);
      }
    }
    catch (ClosedChannelException cce) {
      // Channel already closed; ignore
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to send WebSocket message", e);
    }
  }
  
  public void openSession(Session session, String ticket) {
    try {
      WebSocketTicket ticket1 = webSocketTicketController.findTicket(ticket);
  
      if (verifyTicket(ticket1)) {
        session.getUserProperties().put("UserId", ticket1.getUser());
        sessions.put(ticket, session);
      }
      else {
        try {
          session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Ticket could not be validated."));
        }
        catch (Exception e) {
          // Closing failed, ignore
        }
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to open WebSocket session", e);
    }
  }

  public void closeSession(Session session, String ticket) {
    sessions.remove(session);
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
      } else {
        logger.log(Level.SEVERE, String.format("Received a WebSocket message with invalid ticket '%s'", ticketId));
        session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Invalid ticket"));
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to handle WebSocket message", e);
    }
  }
  
  private boolean verifyTicket(WebSocketTicket ticket) {
    return ticket != null;
  }
  
}
