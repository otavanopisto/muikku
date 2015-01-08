package fi.muikku.plugins.material.coops;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.material.coops.model.CoOpsSession;

public class CoOpsServletContextListener {
  
  @Inject
  private CoOpsSessionController coOpsSessionController;

  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    
    for (CoOpsSession session : coOpsSessionController.listOpenSessions()) {
      coOpsSessionController.closeSession(session, true);
    }
    
  }
  
}
