package fi.otavanopisto.muikku.plugins.schooldatapyramus;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataUserGroupDiscoveredEvent;

@ApplicationScoped
public class UserGroupDiscoveryWaiter {

  private static final long INTERVAL = 10;
  private static final long TIMEOUT = 60000;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    waits = new HashMap<>();
  }

  public Long waitDiscovered(SchoolDataIdentifier userGroupIdentifier) {
    long timeoutTime = System.currentTimeMillis() + TIMEOUT;
    Long result = null;
    if (waits.containsKey(userGroupIdentifier.toId())) {
      return waits.remove(userGroupIdentifier.toId());
    }

    waits.put(userGroupIdentifier.toId(), null);

    while (result == null) {
      result = getUserGroupEntityId(userGroupIdentifier);

      if (System.currentTimeMillis() > timeoutTime) {
        logger.severe("Timeouted when waiting for new user group");
        return null;
      }

      if (result != null) {
        waits.remove(userGroupIdentifier.toId());
      }
      else {
        try {
          Thread.sleep(INTERVAL);
        }
        catch (InterruptedException e) {
        }
      }
    }

    return result;
  }

  public void onWaitingUserGroupDiscoveredEvent(@Observes(during = TransactionPhase.AFTER_SUCCESS) SchoolDataUserGroupDiscoveredEvent event) {
    SchoolDataIdentifier userGroupIdentifier = new SchoolDataIdentifier(event.getIdentifier(), event.getDataSource());
    String id = userGroupIdentifier.toId();

    if (waits.containsKey(id)) {
      waits.put(id, event.getDiscoveredUserGroupEntityId());
    }
  }

  private Long getUserGroupEntityId(SchoolDataIdentifier userGroupIdentifier) {
    return waits.get(userGroupIdentifier.toId());
  }

  private Map<String, Long> waits;
}
