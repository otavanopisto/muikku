package fi.otavanopisto.muikku.plugins.chat;

import java.util.List;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessage;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessageEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.users.UserEntityController;

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
