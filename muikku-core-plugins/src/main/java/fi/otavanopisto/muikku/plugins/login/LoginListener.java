package fi.otavanopisto.muikku.plugins.login;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.model.activitylog.ActivityLogType;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;

public class LoginListener {
  
  @Inject
  private Logger logger;

  @Inject
  private ActivityLogController activityLogController;

  public void onLogin(@Observes LoginEvent loginEvent) {
    logger.info(String.format("User %d logged in", loginEvent.getUserEntityId()));
    activityLogController.createActivityLog(loginEvent.getUserEntityId(), ActivityLogType.SESSION_LOGGEDIN);
  }

}
