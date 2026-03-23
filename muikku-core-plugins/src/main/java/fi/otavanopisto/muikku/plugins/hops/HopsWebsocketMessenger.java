package fi.otavanopisto.muikku.plugins.hops;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;

@ApplicationScoped
public class HopsWebsocketMessenger {

  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @PostConstruct
  public void init() {
    hopsUsers = new ConcurrentHashMap<>();
  }
  
  public void registerUser(Long studentEntityId, Long userEntityId) {
    Set<Long> userIds = hopsUsers.get(studentEntityId);
    if (userIds == null) {
      userIds = new HashSet<>();
      userIds.add(studentEntityId);
      userIds.add(userEntityId);
      hopsUsers.put(studentEntityId, userIds);
    }
    else {
      userIds.add(userEntityId);
    }
  }
  
  public void sendMessage(Long studentEntityId, String eventType, Object data) {
    Set<Long> userIds = hopsUsers.get(studentEntityId);
    if (userIds != null && !userIds.isEmpty()) {
      webSocketMessenger.sendMessage(eventType, data, userIds);
    }
  }
  
  @Schedule (dayOfWeek="*", hour = "2", minute = "15", persistent = false) 
  public void purgeUsers() {
    hopsUsers.clear();
  }

  // Student entity id -> Set of userEntity ids to be notified
  private ConcurrentHashMap<Long, Set<Long>> hopsUsers;

}
