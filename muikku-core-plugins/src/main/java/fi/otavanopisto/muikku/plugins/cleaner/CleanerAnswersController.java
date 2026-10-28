package fi.otavanopisto.muikku.plugins.cleaner;

import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.plugins.workspace.MaterialDeleteController;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialFieldAnswerDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceMaterialReplyDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class CleanerAnswersController extends CleanerController {

  public static final String SETTING_USER = "cleaner.answers.userEntityId";
  public static final String SETTING_REPLIES = "cleaner.answers.replyIds";
  public static final String SETTING_ENABLED = "cleaner.answers.enabled";
  public static final String SETTING_BATCH = "cleaner.answers.batch";
  
  @Inject
  private Logger logger;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private WorkspaceMaterialReplyDAO workspaceMaterialReplyDAO;
  
  @Inject
  private WorkspaceMaterialFieldAnswerDAO workspaceMaterialFieldAnswerDAO;
  
  @Inject
  private MaterialDeleteController materialDeleteController;
  
  public void runCleanup() {
    
    // Simple master switch check
    
    if (!isEnabled()) {
      return;
    }
    
    // Let's run one cycle
    
    logger.info("Running answers cleanup");
    long ms1 = System.currentTimeMillis();
    try {
      List<Long> replyIds;
      int batchSize = Integer.parseInt(systemSettingsController.getSetting(SETTING_BATCH));
      Long userEntityId = Long.parseLong(systemSettingsController.getSetting(SETTING_USER));
      String replyIdsStr = systemSettingsController.getSetting(SETTING_REPLIES);
      if (StringUtils.isBlank(replyIdsStr)) {
        // We have no replies to process, prepare the next student and their replies
        userEntityId = prepareNextUser(userEntityId);
        if (userEntityId == null) {
          // No student found to process this cycle
          return;
        }
        // Collect reply ids of the student. Snapshot of all needed because if the student returns
        // while cleanup is in progress, as unlikely as it is, the new entries remain intact. 
        replyIds = workspaceMaterialReplyDAO.listIdsByUserEntityId(userEntityId);
        logger.info(String.format("UserEntity %d has %d replies", userEntityId, replyIds.size()));
        if (replyIds.size() == 0) {
          // Student has no replies to clean, next cycle will proceed to someone else
          systemSettingsController.setSetting(SETTING_REPLIES, null);
          return;
        }
        else {
          replyIdsStr = replyIds.stream().map(String::valueOf).collect(Collectors.joining(","));
          systemSettingsController.setSetting(SETTING_REPLIES, replyIdsStr);
        }
      }
      else {
        // We have previously stored reply ids of some user still to process
        replyIds = Arrays.stream(replyIdsStr.split(",")).map(Long::parseLong).collect(Collectors.toList());
      }
      
      // The big scary cleanup
      
      int deletedReplies = 0;
      int deletedAnswers = 0;
      for (int i = 0; i < batchSize; i++) {
        if (replyIds.size() == 0) {
          break;
        }
        WorkspaceMaterialReply reply = workspaceMaterialReplyDAO.findById(replyIds.get(0));
        if (reply != null) {
          if (reply.getUserEntityId().longValue() != userEntityId.longValue()) {
            shutdown(Level.SEVERE, String.format("reply %d has user %d mismatch", reply.getId(), userEntityId));
            return;
          }
          List<WorkspaceMaterialFieldAnswer> answers = workspaceMaterialFieldAnswerDAO.listByReply(reply); 
          for (WorkspaceMaterialFieldAnswer answer : answers) {
            materialDeleteController.deleteWorkspaceMaterialFieldAnswer(answer);
            deletedAnswers++;
          }
          materialDeleteController.deleteWorkspaceMaterialReply(reply);
          deletedReplies++;
        }
        replyIds.remove(0);
      }
      
      // Store remaining reply ids to be cleaned in the next cycle
      
      replyIdsStr = replyIds.stream().map(String::valueOf).collect(Collectors.joining(","));
      systemSettingsController.setSetting(SETTING_REPLIES, replyIdsStr);
      
      // Statistics logging
      
      long ms2 = System.currentTimeMillis();
      logger.info(String.format("Deleted %d replies (%d answers) of userEntity %d in %dms",
          deletedReplies,
          deletedAnswers,
          userEntityId,
          (ms2 - ms1)));
    }
    catch (Exception e) {
      shutdown(Level.SEVERE, "exception running cleanup", e);
    }
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
  protected void log(Level level, String message, Throwable t) {
    if (t == null) {
      logger.log(level, message);
    }
    else {
      logger.log(level, message, t);
    }
  }

  private boolean isEnabled() {
    return StringUtils.equals(systemSettingsController.getSetting(SETTING_ENABLED), "true");
  }
  
}