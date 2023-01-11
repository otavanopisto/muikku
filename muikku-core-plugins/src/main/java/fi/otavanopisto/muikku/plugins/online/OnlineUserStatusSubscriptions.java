package fi.otavanopisto.muikku.plugins.online;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.events.LogoutEvent;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.websocket.MuikkuWebSocketEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessageEvent;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;

@ApplicationScoped
public class OnlineUserStatusSubscriptions {

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserGroupGuidanceController userGroupGuidanceController;
  
  @Inject
  private OnlineUsersController onlineUsersController;
  
  @Inject
  private WebSocketMessenger webSocketMessenger;
  
  @PostConstruct
  private void postConstruct() {
    this.subscriptions = new ConcurrentHashMap<>();
  }
  
  /**
   * "Subscribe" a user to observe status notifications from other users. Defaults
   * to the users' guidance counselors at the moment.
   * 
   * @param userEntityId
   */
  private void subscribe(long userEntityId) {
    if (!subscriptions.containsKey(userEntityId)) {
      UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      boolean onlyMessageReceivers = false;
      List<UserEntity> guidanceCouncelors = userGroupGuidanceController.getGuidanceCounselors(userEntity.defaultSchoolDataIdentifier(), onlyMessageReceivers );

      Set<Long> subscribedIds = guidanceCouncelors.stream().map(UserEntity::getId).collect(Collectors.toSet());
      subscribedIds.add(userEntityId);
      
      subscriptions.put(userEntityId, subscribedIds);
    }
  }

  /**
   * Observes LoginEvents from system and subscribes the logged in user on login.
   * 
   * @param loginEvent
   */
  protected void observeLogin(@Observes LoginEvent loginEvent) {
    long userEntityId = loginEvent.getUserEntityId();
    subscribe(userEntityId);
  }
  
  /**
   * Observes LogoutEvents from system and unsubscribes the user on logout.
   * @param logoutEvent
   */
  protected void observeLogout(@Observes LogoutEvent logoutEvent) {
    // TODO Cleanup on logout
  }

  /**
   * Observes online status changes and broadcasts them to websockets for interested parties.
   * 
   * @param onlineStatusChange
   */
  public void observeOnlineStatusChanges(@Observes OnlineStatusChange onlineStatusChange) {
    Set<Long> informedIds = new HashSet<>();
    
    Long userEntityId = onlineStatusChange.getUserEntityId();
    if (userEntityId != null) {
      Set<Entry<Long, Set<Long>>> subscriptionIterator = subscriptions.entrySet();
      
      for (Entry<Long, Set<Long>> subscription : subscriptionIterator) {
        if (subscription.getValue() != null && subscription.getValue().contains(userEntityId)) {
          informedIds.add(subscription.getKey());
        }
      }
    }

    if (CollectionUtils.isNotEmpty(informedIds)) {
      broadcastWebsocketOnlineStatus(informedIds, onlineStatusChange);
    }
  }

  /**
   * Observes request from client to list statuses for followed users.
   * 
   * @param event
   */
  public void listFollowedUserStatuses(@Observes @MuikkuWebSocketEvent("online:list") WebSocketMessageEvent event) {
    Long userEntityId = event.getUserEntityId();
    Set<Long> followList = subscriptions.get(userEntityId);
    
    List<OnlineStatusChange> broadcastStatuses;

    if (followList != null) {
      broadcastStatuses = followList.stream()
          .map(followedUserEntityId -> new OnlineStatusChange(followedUserEntityId, onlineUsersController.getUserOnlineStatus(followedUserEntityId)))
          .collect(Collectors.toList());
    } else {
      broadcastStatuses = Collections.emptyList();
    }

    webSocketMessenger.sendMessageByIds("online:status", broadcastStatuses, Arrays.asList(userEntityId));
  }

  /**
   * Broadcast status changes via websocket to given parties.
   * 
   * @param informedIds
   * @param broadcastStatuses
   */
  private void broadcastWebsocketOnlineStatus(Collection<Long> informedIds, OnlineStatusChange ... broadcastStatuses) {
    webSocketMessenger.sendMessageByIds("online:status", broadcastStatuses, informedIds);
  }
  
  /**
   * To prevent iterating over the whole list this should be replaced with a bi-directional
   * multi-valued thread-safe map which can be efficiently also cleaned on request. Didn't
   * find one though.
   */
  private ConcurrentHashMap<Long, Set<Long>> subscriptions;
}
