package fi.otavanopisto.muikku.plugins.cleanup;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.plugins.activitylog.dao.ActivityLogDAO;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLog;

@Stateless
public class CleanupActivityJob extends CleanupJob {

  public static final String SETTING_USER = "cleanup.activity.userEntityId";
  public static final String SETTING_ACTIVITIES = "cleanup.activity.activityIds";
  public static final String SETTING_ENABLED = "cleanup.activity.enabled";
  public static final String SETTING_BATCH = "cleanup.activity.batch";
  
  @Inject
  private Logger logger;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private ActivityLogDAO activityLogDAO;
  
  // Explicitly stated transaction type, just in case
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void cleanup() {
    
    // Simple master switch check
    
    if (!isEnabled()) {
      return;
    }
    
    // Let's run one cycle
    
    long ms1 = System.currentTimeMillis();
    List<Long> activityIds;
    int batchSize = Integer.parseInt(systemSettingsController.getSetting(SETTING_BATCH));
    Long userEntityId = Long.parseLong(systemSettingsController.getSetting(SETTING_USER));
    String activityIdsStr = systemSettingsController.getSetting(SETTING_ACTIVITIES);
    if (StringUtils.isBlank(activityIdsStr)) {
      // We have no activities to process, prepare the next student and their activities
      userEntityId = prepareNextUser(userEntityId);
      if (userEntityId == null) {
        // No student found to process this cycle
        return;
      }
      // Collect activity ids of the student. Snapshot of all needed because if the student returns
      // while cleanup is in progress, as unlikely as it is, the new entries remain intact. 
      activityIds = activityLogDAO.listIdsByUserEntityId(userEntityId);
      logger.info(String.format("Student %d has %d activities", userEntityId, activityIds.size()));
      if (activityIds.size() == 0) {
        // Student has no activities to clean, next cycle will proceed to someone else
        return;
      }
      else {
        activityIdsStr = activityIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        systemSettingsController.setSetting(SETTING_ACTIVITIES, activityIdsStr);
      }
    }
    else {
      // We have previously stored activity ids of some user still to process
      activityIds = Arrays.stream(activityIdsStr.split(",")).map(Long::parseLong).collect(Collectors.toList());
    }

    // The big scary cleanup

    int deletedActivities = 0;
    for (int i = 0; i < batchSize; i++) {
      if (activityIds.size() == 0) {
        break;
      }
      ActivityLog activity = activityLogDAO.findById(activityIds.get(0));
      if (activity != null) {
        if (activity.getUserEntityId().longValue() != userEntityId.longValue()) {
          shutdown(Level.SEVERE, String.format("activity %d does not belong to student %d", activity.getId(), userEntityId));
          return;
        }
        activityLogDAO.delete(activity);
        deletedActivities++;
      }
      activityIds.remove(0);
    }

    // Store remaining activity ids to be cleaned in the next cycle

    activityIdsStr = activityIds.stream().map(String::valueOf).collect(Collectors.joining(","));
    systemSettingsController.setSetting(SETTING_ACTIVITIES, activityIdsStr);

    // Statistics logging

    long ms2 = System.currentTimeMillis();
    logger.info(String.format("Deleted %d activities of student %d in %dms",
        deletedActivities,
        userEntityId,
        (ms2 - ms1)));
  }
  
  public void changeUserEntityId(Long userEntityId) {
    systemSettingsController.setSetting(SETTING_USER, Long.toString(userEntityId));   
  }
  
  public void changeBatchSize(int batchSize) {
    systemSettingsController.setSetting(SETTING_BATCH, Integer.toString(batchSize));   
  }

  @Override
  public void toggleEnabled(boolean enabled) {
    systemSettingsController.setSetting(SETTING_ENABLED, Boolean.toString(enabled));
  }
  
  @Override
  protected String getUserEntityIdSystemSettingKey() {
    return SETTING_USER;
  }

  @Override
  protected void log(Level level, String message) {
    logger.log(level, message);
  }

  private boolean isEnabled() {
    return StringUtils.equals(systemSettingsController.getSetting(SETTING_ENABLED), Boolean.toString(true));
  }
  
}