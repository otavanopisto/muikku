package fi.otavanopisto.muikku.plugins.online;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Event;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;

@ApplicationScoped
@Singleton
public class OnlineUsersController {

  // Threshold in milliseconds after which the online status is considered invalid
  private static final long THRESHOLD_MS = 30 * 1000;

  @Inject
  private Event<OnlineStatusChange> onlineStatusChangeEvent;
  
  @PostConstruct
  private void init() {
    map = new ConcurrentHashMap<>();
  }
  
  public boolean isUserOnline(UserEntity userEntity) {
    Long time = map.get(userEntity.getId());
    return time != null ? inThreshold(time) : false;
  }
  
  public void checkin(UserEntity userEntity) {
    map.put(userEntity.getId(), System.currentTimeMillis());
    
    onlineStatusChangeEvent.fire(new OnlineStatusChange(userEntity.getId(), OnlineStatus.ONLINE));
  }
  
  public void checkout(UserEntity userEntity) {
    map.remove(userEntity.getId());

    onlineStatusChangeEvent.fire(new OnlineStatusChange(userEntity.getId(), OnlineStatus.OFFLINE));
  }
  
  private boolean inThreshold(Long time) {
    return (System.currentTimeMillis() - time) < THRESHOLD_MS;
  }

  
  @Schedule(second = "*/10", minute = "*", hour = "*", persistent = false)
  private void cleanup() {
    System.out.println("Schedule " + map.size() + " @ " + new Date().toString());
    map.forEach((k, v) -> {
      System.out.println(String.format("%d : %d : %d : %b", k, v, (System.currentTimeMillis() - v), inThreshold(v)));
    });

    map.entrySet().removeIf((entry) -> !inThreshold(entry.getValue()));
    
//    map.forEach((k, v) -> {
//      if (!inThreshold(v)) {
//        // Note: use remove (k, v) to ensure that if the value changes in between it doesn't get removed
//        map.remove(k, v);
//      }
//    });
  }
  
  private ConcurrentHashMap<Long, Long> map;
}
