package fi.otavanopisto.muikku.plugins.online;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketMessenger;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserGroupGuidanceController;

@SessionScoped
@Stateful
public class CurrentUserSessionOnlineConnections {

  @Inject
  private transient Logger logger;
  
  @Inject
  private transient SessionController sessionController;
  
  @Inject
  private transient UserGroupGuidanceController userGroupGuidanceController;

  @Inject
  private transient WebSocketMessenger webSocketMessenger;

  @PostConstruct
  public void init() {
    System.out.println(getClass().getSimpleName() + " initialized");
  }
  
  public void observeOnlineStatusChanges(@Observes OnlineStatusChange onlineStatusChange) {
    ensureInitialization();
    
    System.out.println("onlinestatuschange " + sessionController.isLoggedIn());
    if (sessionController.isLoggedIn()) {
      System.out.println(String.format("Logged: %d, status id: %d, status: %s", sessionController.getLoggedUserEntity().getId(), onlineStatusChange.getUserEntityId(), onlineStatusChange.getStatus()));
      System.out.println(guidanceCounselorIds != null ? guidanceCounselorIds.toString() : "null list");
    }

    if (sessionController.isLoggedIn() && CollectionUtils.isNotEmpty(guidanceCounselorIds) && guidanceCounselorIds.contains(onlineStatusChange.getUserEntityId())) {
      System.out.println(String.format("User %d guidanceCounselor %d has state %s", sessionController.getLoggedUserEntity().getId(), onlineStatusChange.getUserEntityId(), onlineStatusChange.getStatus()));
      
      webSocketMessenger.sendMessage("tilipitappi", onlineStatusChange, Arrays.asList(sessionController.getLoggedUserEntity()));
    }
  }
  
  private void ensureInitialization() {
    if (!initialized) {
      if (sessionController.isLoggedIn()) {
        try {
          boolean onlyMessageReceivers = true;
          List<UserEntity> guidanceCounselors = userGroupGuidanceController.getGuidanceCounselors(sessionController.getLoggedUser(), onlyMessageReceivers);
          guidanceCounselorIds = guidanceCounselors.stream().map(guidanceCounselor -> guidanceCounselor.getId()).collect(Collectors.toSet());
          
          initialized = true;
        }
        catch (Exception ex) {
          logger.log(Level.SEVERE, "Failed to resolve user information.", ex);
        }
      }
    }
  }
  
  private boolean initialized = false;
  private Set<Long> guidanceCounselorIds;
}
