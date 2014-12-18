package fi.muikku.plugins.chat;

import java.io.IOException;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.websocket.EncodeException;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.muikku.plugins.websocket.WebSocketMessage;
import fi.muikku.plugins.websocket.WebSocketMessenger;
import fi.muikku.users.UserEntityController;

@Stateless
public class ChatMessageHandler {

  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private UserEntityController userEntityController; 
  
  public void handleMessage(@Observes @MuikkuWebSocketEvent("Chat:message") WebSocketMessage message) {
    try {
      ObjectMapper mapper = new ObjectMapper();

      ChatMessage msg = mapper.convertValue(message.getData(), ChatMessage.class);

      // TODO: Room magic
      // TODO: Recipients
      
      List<UserEntity> recipients = userEntityController.listUserEntities();
      
      webSocketMessenger.sendMessage2("Chat:message", msg, recipients);
    } catch (IOException | EncodeException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
  }

}
