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
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationDeleteController;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceNodeEvaluationDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluation;

@Stateless
public class CleanupEvaluationsJob extends CleanupJob {

  public static final String SETTING_USER = "cleanup.evaluations.userEntityId";
  public static final String SETTING_EVALUATIONS = "cleanup.evaluations.ids";
  public static final String SETTING_ENABLED = "cleanup.evaluations.enabled";
  public static final String SETTING_BATCH = "cleanup.evaluations.batch";
  
  @Inject
  private Logger logger;
  
  @Inject
  private SystemSettingsController systemSettingsController;
  
  @Inject
  private WorkspaceNodeEvaluationDAO workspaceNodeEvaluationDAO;
  
  @Inject
  private EvaluationDeleteController evaluationDeleteController;
  
  // Explicitly stated transaction type, just in case
  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void cleanup() {
    
    // Simple master switch check
    
    if (!isEnabled()) {
      return;
    }
    
    // Let's run one cycle
    
    long ms1 = System.currentTimeMillis();
    List<Long> evaluationIds;
    int batchSize = Integer.parseInt(systemSettingsController.getSetting(SETTING_BATCH));
    Long userEntityId = Long.parseLong(systemSettingsController.getSetting(SETTING_USER));
    String evaluationIdsStr = systemSettingsController.getSetting(SETTING_EVALUATIONS);
    if (StringUtils.isBlank(evaluationIdsStr)) {
      // We have no evaluations to process, prepare the next student and their evaluations
      userEntityId = prepareNextUser(userEntityId);
      if (userEntityId == null) {
        // No student found to process this cycle
        return;
      }
      // Collect evaluation ids of the student. Snapshot of all needed because if the student returns
      // while cleanup is in progress, as unlikely as it is, the new entries remain intact. 
      evaluationIds = workspaceNodeEvaluationDAO.listIdsByUserEntityId(userEntityId); 
      logger.info(String.format("Student %d has %d evaluations", userEntityId, evaluationIds.size()));
      if (evaluationIds.size() == 0) {
        // Student has no evaluations to clean, next cycle will proceed to someone else
        return;
      }
      else {
        evaluationIdsStr = evaluationIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        systemSettingsController.setSetting(SETTING_EVALUATIONS, evaluationIdsStr);
      }
    }
    else {
      // We have previously stored evaluation ids of some user still to process
      evaluationIds = Arrays.stream(evaluationIdsStr.split(",")).map(Long::parseLong).collect(Collectors.toList());
    }

    // The big scary cleanup

    int deletedEvaluations = 0;
    for (int i = 0; i < batchSize; i++) {
      if (evaluationIds.size() == 0) {
        break;
      }
      WorkspaceNodeEvaluation evaluation = workspaceNodeEvaluationDAO.findById(evaluationIds.get(0));
      if (evaluation != null) {
        if (evaluation.getStudentEntityId().longValue() != userEntityId.longValue()) {
          shutdown(Level.SEVERE, String.format("evaluation %d does not belong to student %d", evaluation.getId(), userEntityId));
          return;
        }
        evaluationDeleteController.deleteWorkspaceNodeEvaluation(evaluation);
        deletedEvaluations++;
      }
      evaluationIds.remove(0);
    }

    // Store remaining reply ids to be cleaned in the next cycle

    evaluationIdsStr = evaluationIds.stream().map(String::valueOf).collect(Collectors.joining(","));
    systemSettingsController.setSetting(SETTING_EVALUATIONS, evaluationIdsStr);

    // Statistics logging

    long ms2 = System.currentTimeMillis();
    logger.info(String.format("Deleted %d evaluations of student %d in %dms",
        deletedEvaluations,
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