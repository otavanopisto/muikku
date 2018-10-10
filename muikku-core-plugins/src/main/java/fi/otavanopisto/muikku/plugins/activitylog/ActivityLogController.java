package fi.otavanopisto.muikku.plugins.activitylog;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.activitylog.dao.ActivityLogDAO;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;

public class ActivityLogController {

  @Inject
  private ActivityLogDAO activityLogDAO;
  
  public ActivityLog createActivityLog(Long userEntityId, ActivityLogType type) {
    return activityLogDAO.create(userEntityId, type, null, null);
  }
  
  public ActivityLog createActivityLog(Long userEntityId, ActivityLogType type, Long workspaceId, Long contextId) {
    return activityLogDAO.create(userEntityId, type, workspaceId, contextId);
  }
}
