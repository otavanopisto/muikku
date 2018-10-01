package fi.otavanopisto.muikku.plugins.activitylog.dao;

import java.util.Date;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog_;

public class ActivityLogDAO extends CorePluginsDAO<ActivityLog>{
  
  private static final long serialVersionUID = 7895651610938408594L;
  
  public ActivityLog create(Long userEntityId, ActivityLogType type, Long workspaceId, Long contextId) {
    ActivityLog activityLog = new ActivityLog();
    activityLog.setUserEntityId(userEntityId);
    activityLog.setActivityLogType(type);
    activityLog.setTimestamp(new Date());
    activityLog.setWorkspaceId(workspaceId);
    activityLog.setContextId(contextId);
    return persist(activityLog);
  }
}
