package fi.otavanopisto.muikku.plugins.pedagogy;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;

@ApplicationScoped
public class PedagogyFormWebsocketMessenger {

  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @PostConstruct
  public void init() {
    pedagogyFormUsers = new ConcurrentHashMap<>();
  }
  
  public void registerUser(String studentIdentifier, Long userEntityId) {
    Set<Long> userIds = pedagogyFormUsers.get(studentIdentifier);
    if (userIds == null) {
      userIds = new HashSet<>();
      userIds.add(userEntityId);
      pedagogyFormUsers.put(studentIdentifier, userIds);
    }
    else {
      userIds.add(userEntityId);
    }
  }
  
  public void sendMessage(String studentIdentifier, String eventType, Object data) {
    Set<Long> userIds = pedagogyFormUsers.get(studentIdentifier);
    if (userIds != null && !userIds.isEmpty()) {
      webSocketMessenger.sendMessage(eventType, data, userIds);
    }
  }
  
  @Schedule (dayOfWeek="*", hour = "2", minute = "15", persistent = false) 
  public void purgeUsers() {
    pedagogyFormUsers.clear();
  }

  // Student identifier -> userEntity id set
  private ConcurrentHashMap<String, Set<Long>> pedagogyFormUsers;

}
