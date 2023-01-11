package fi.otavanopisto.muikku.plugins.online;

import java.util.List;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

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
  
  /**
   * Returns online status for user
   * 
   * @param userEntity
   * @return
   */
  public OnlineStatus getUserOnlineStatus(UserEntity userEntity) {
    return getUserOnlineStatus(userEntity.getId());
  }
  
  /**
   * Returns online status for user
   * 
   * @param userEntityId
   * @return
   */
  public OnlineStatus getUserOnlineStatus(Long userEntityId) {
    Long time = map.get(userEntityId);
    return time != null && inThreshold(time) ? OnlineStatus.ONLINE : OnlineStatus.OFFLINE;
  }
  
  /**
   * Checkin to refresh when user has been last active
   * 
   * @param userEntity
   */
  public void checkin(UserEntity userEntity) {
    checkin(userEntity.getId());
  }

  /**
   * Checkin to refresh when user has been last active
   * 
   * @param userEntityId
   */
  public void checkin(Long userEntityId) {
    Long previousValue = map.put(userEntityId, System.currentTimeMillis());
    
    // If previous value was not in threshold the status has changed
    if (previousValue == null || !inThreshold(previousValue)) {
      onlineStatusChangeEvent.fire(new OnlineStatusChange(userEntityId, OnlineStatus.ONLINE));
    }
  }
  
  /**
   * Checkout / logout
   * 
   * @param userEntity
   */
  public void checkout(UserEntity userEntity) {
    checkout(userEntity.getId());
  }
  
  /**
   * Checkout / logout
   * 
   * @param userEntityId
   */
  public void checkout(Long userEntityId) {
    map.remove(userEntityId);

    onlineStatusChangeEvent.fire(new OnlineStatusChange(userEntityId, OnlineStatus.OFFLINE));
  }
  
  /**
   * Returns true if the given time (in milliseconds) is within threshold
   * 
   * @param time
   * @return
   */
  private boolean inThreshold(Long time) {
    return (System.currentTimeMillis() - time) < THRESHOLD_MS;
  }

  /**
   * Cleanup scheduler to cleanup status' that have expired
   */
  @Schedule(second = "*/10", minute = "*", hour = "*", persistent = false)
  private void cleanup() {
    List<Entry<Long, Long>> outOfThreshold = map.entrySet().stream()
      .filter(entry -> !inThreshold(entry.getValue()))
      .collect(Collectors.toList());

    for (Entry<Long, Long> entry : outOfThreshold) {
      // Remove only if the value is still untouched
      if (map.remove(entry.getKey(), entry.getValue())) {
        onlineStatusChangeEvent.fire(new OnlineStatusChange(entry.getKey(), OnlineStatus.OFFLINE));
      }
    }
  }
  
  private ConcurrentHashMap<Long, Long> map;
}
