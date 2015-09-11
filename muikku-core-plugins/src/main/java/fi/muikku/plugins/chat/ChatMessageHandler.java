package fi.muikku.plugins.chat;

import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.muikku.plugins.websocket.WebSocketMessage;
import fi.muikku.plugins.websocket.WebSocketMessageEvent;
import fi.muikku.plugins.websocket.WebSocketMessenger;
import fi.muikku.users.UserEntityController;

@Stateless
public class ChatMessageHandler {

  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @Inject
  private UserEntityController userEntityController; 
  
  public void handleMessage(@Observes @MuikkuWebSocketEvent("Chat:message") WebSocketMessageEvent event) {
    WebSocketMessage message = event.getMessage();
    
    ObjectMapper mapper = new ObjectMapper();

    ChatMessage msg = mapper.convertValue(message.getData(), ChatMessage.class);

    // TODO: Room magic
    // TODO: Recipients
    
    List<UserEntity> recipients = userEntityController.listUserEntities();
    
    webSocketMessenger.sendMessage2("Chat:message", msg, recipients);
  }

}
