package fi.otavanopisto.muikku.plugins.logindetails;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;

public class LoginListener {
  
  @Inject
  private LoginDetailController loginDetailController;
  
  @Inject
  private ActivityLogController activityLogController;
  
  public void onLogin(@Observes LoginEvent loginEvent){
    loginDetailController.log(loginEvent);
    activityLogController.createActivityLog(loginEvent.getUserEntityId(), ActivityLogType.SESSION_LOGEDIN);
  }
  
}
