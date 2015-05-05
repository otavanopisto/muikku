package fi.muikku.plugins.websocket;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.websocket.CloseReason;
import javax.websocket.Session;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.model.users.UserEntity;

@ApplicationScoped
public class WebSocketMessenger {
  
  @Inject
  private Logger logger;

  @Inject
  private Event<WebSocketMessage> webSocketMessageEvent;

  @Inject
  private WebSocketTicketController webSocketTicketController;
  
  private Set<Session> sessions = new HashSet<Session>();
  
  /**
   * TODO: Logged user management in session (incl. Login/logout)
   */
  
  public void sendMessage2(String eventType, Object data, List<UserEntity> recipients) {
    List<Long> recipientIds = new ArrayList<Long>(recipients.size());
    for (UserEntity userEntity : recipients) {
      recipientIds.add(userEntity.getId());
    }

    sendMessage(eventType, data, recipientIds);
  }
  
  public void sendMessage(String eventType, Object data, List<Long> recipients) {
    try {
      WebSocketMessage message = new WebSocketMessage(eventType, data);
      ObjectMapper mapper = new ObjectMapper();
      String strMessage = mapper.writeValueAsString(message);
  
      synchronized (this) {
        for (Session session : sessions) {
          if (session.isOpen()) {
            Long userId = (Long) session.getUserProperties().get("UserId");
    
            if ((userId != null) && (recipients.contains(userId))) {
              session.getBasicRemote().sendText(strMessage);
            }
          }
        }
      }    
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to send WebSocket message", e);
    }
  }
  
  private boolean verifyTicket(WebSocketTicket ticket) {
    return ticket != null;
  }
  
  protected void openSession(Session session, String ticket) {
    try {
      WebSocketTicket ticket1 = webSocketTicketController.findTicket(ticket);
  
      if (verifyTicket(ticket1)) {
        synchronized (this) {
          session.getUserProperties().put("UserId", ticket1.getUser());
          sessions.add(session);
        }
      } else {
        session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Ticket could not be validated."));
      }
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Failed to open WebSocket session", e);
    }
  }

  protected void closeSession(Session session, String ticket) {
    synchronized (this) {
      sessions.remove(session);
    }
    
    webSocketTicketController.removeTicket(ticket);
  }

  protected void handleMessage(String message, Session session, String ticket) {
    synchronized (this) {
      ObjectMapper mapper = new ObjectMapper();

      try {
        WebSocketMessage message2 = mapper.readValue(message, WebSocketMessage.class);

        webSocketMessageEvent.select(new MuikkuWebSocketEventLiteral(message2.getEventType())).fire(message2);
      } catch (Exception e) {
        logger.log(Level.SEVERE, "Failed to handle WebSocket message", e);
      }
    }
  }
  
}
