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
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;

@ApplicationScoped
public class WorkspaceDiscoveryWaiter {
  
  private static final long INTERVAL = 10;
  private static final long TIMEOUT = 60000; 

  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() {
    waits = new HashMap<>();
  }
  
  public Long waitDiscovered(SchoolDataIdentifier workspaceIdentifier) {
    long timeoutTime = System.currentTimeMillis() + TIMEOUT;    
    Long result = null;
    if (waits.containsKey(workspaceIdentifier.toId())) {
      return waits.remove(workspaceIdentifier.toId());
    }
    
    waits.put(workspaceIdentifier.toId(), null);
    
    while (result == null) {
      result = getWorkspaceEntityId(workspaceIdentifier);
    
      if (System.currentTimeMillis() > timeoutTime) {
        logger.severe("Timeouted when waiting for new workspace");
        return null;
      }
      
      if (result != null) {
        waits.remove(workspaceIdentifier.toId());
      } else {
        try {
          Thread.sleep(INTERVAL);
        } catch (InterruptedException e) {
        }
      }
    }
    
    return result;
  }
  
  public void onWaitingWorkspaceDiscoveredEvent(@Observes (during = TransactionPhase.AFTER_SUCCESS) SchoolDataWorkspaceDiscoveredEvent event) {
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(event.getIdentifier(), event.getDataSource());
    String id = workspaceIdentifier.toId();
    
    if (waits.containsKey(id)) {
      waits.put(id, event.getDiscoveredWorkspaceEntityId());
    }
  }
  
  private Long getWorkspaceEntityId(SchoolDataIdentifier workspaceIdentifier) {
    return waits.get(workspaceIdentifier.toId());
  }
  
  private Map<String, Long> waits;
}
