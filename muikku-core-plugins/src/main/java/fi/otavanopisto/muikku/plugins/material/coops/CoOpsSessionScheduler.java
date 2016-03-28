package fi.otavanopisto.muikku.plugins.material.coops;

import java.util.List;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.coops.model.CoOpsSession;

@Singleton
public class CoOpsSessionScheduler {

  @Inject
  private CoOpsSessionController coOpsSessionController;
  
  @Schedule(second = "*/15", minute = "*", hour = "*", persistent = false)
  public void sessionCloseScheduler() {
    List<CoOpsSession> timedoutSessions = coOpsSessionController.listTimedoutRestSessions();
    for (CoOpsSession timedoutSession : timedoutSessions) {
      coOpsSessionController.closeSession(timedoutSession);
    }
  }
  
}
