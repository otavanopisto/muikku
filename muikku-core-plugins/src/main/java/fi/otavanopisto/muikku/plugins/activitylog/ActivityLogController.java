package fi.otavanopisto.muikku.plugins.activitylog;

import java.util.Date;
import java.util.List;

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
  
  public ActivityLog createActivityLog(Long userEntityId, ActivityLogType type, Long workspaceEntityId, Long contextId) {
    return activityLogDAO.create(userEntityId, type, workspaceEntityId, contextId);
  }
  
  public List<ActivityLog> listActivityLogsByUserEntityIdAndWorkspaceEntityId(Long userEntityId, Long workspaceEntityId){
    return listActivityLogsByUserEntityIdAndWorkspaceEntityId(userEntityId, workspaceEntityId, new Date(0));
  }
  
  public List<ActivityLog> listActivityLogsByUserEntityIdAndWorkspaceEntityId(Long userEntityId, Long workspaceEntityId, Date from){
    return listActivityLogsByUserEntityIdAndWorkspaceEntityId(userEntityId, workspaceEntityId, from, new Date());
  }
  
  public List<ActivityLog> listActivityLogsByUserEntityIdAndWorkspaceEntityId(Long userEntityId, Long workspaceEntityId, Date from, Date to){
    return activityLogDAO.listActivityLogs(userEntityId, workspaceEntityId, from, to);
  }
  
  public List<Long> listWorkspacesWithActivityLogsByUserId(Long userEntityId){
    return activityLogDAO.listWorkspaces(userEntityId);
  }
}
