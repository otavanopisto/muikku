package fi.muikku.plugins.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.websocket.EncodeException;
import javax.websocket.Session;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.model.users.UserEntity;
import fi.muikku.session.SessionController;

@ApplicationScoped
public class WebSocketMessenger {

  @Inject
  private Event<WebSocketMessage> webSocketMessageEvent;

  @Inject
  private SessionController sessionController;
  
  private Set<Session> sessions = new HashSet<Session>();
  
  /**
   * TODO: Logged user management in session (incl. Login/logout)
   */
  
  public void sendMessage2(String eventType, Object data, List<UserEntity> recipients) throws IOException, EncodeException {
    List<Long> recipientIds = new ArrayList<Long>(recipients.size());
    for (UserEntity userEntity : recipients) {
      recipientIds.add(userEntity.getId());
    }

    sendMessage(eventType, data, recipientIds);
  }
  
  public void sendMessage(String eventType, Object data, List<Long> recipients) throws IOException, EncodeException {
    WebSocketMessage message = new WebSocketMessage(eventType, data);
    ObjectMapper mapper = new ObjectMapper();
    String strMessage = mapper.writeValueAsString(message);

    synchronized (this) {
      for (Session session : sessions) {
//        Long userId = (Long) session.getUserProperties().get("UserId");
//
//        if ((userId != null) && (recipients.contains(userId))) {
          session.getBasicRemote().sendText(strMessage);
//        }
      }
    }    
  }
  
  protected void openSession(Session session) {
    synchronized (this) {
//      if (sessionController.getLoggedUserEntity() != null)
//        session.getUserProperties().put("UserId", sessionController.getLoggedUserEntity());

      sessions.add(session);
    }
  }

  protected void closeSession(Session session) {
    synchronized (this) {
      sessions.remove(session);
    }
  }

  protected void handleMessage(String message, Session session) {
    synchronized (this) {
      ObjectMapper mapper = new ObjectMapper();

//      if (sessionController.getLoggedUserEntity() != null)
//        session.getUserProperties().put("UserId", sessionController.getLoggedUserEntity());

      try {
        WebSocketMessage message2 = mapper.readValue(message, WebSocketMessage.class);

        webSocketMessageEvent.select(new MuikkuWebSocketEventLiteral(message2.getEventType())).fire(message2);
      } catch (JsonParseException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      } catch (JsonMappingException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      } catch (IOException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }
  }
  
}
