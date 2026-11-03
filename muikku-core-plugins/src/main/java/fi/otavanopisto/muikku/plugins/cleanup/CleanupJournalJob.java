package fi.otavanopisto.muikku.plugins.cleanup;

import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.plugins.evaluation.dao.WorkspaceJournalFeedbackDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceJournalFeedback;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceJournalCommentDAO;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceJournalEntryDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;

@Stateless
public class CleanupJournalJob extends CleanupJob {

  public static final String SETTING_USER = "cleanup.journal.userEntityId";
  public static final String SETTING_ENABLED = "cleanup.journal.enabled";

  @Inject
  private Logger logger;
  
  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  private WorkspaceJournalEntryDAO workspaceJournalEntryDAO;

  @Inject
  private WorkspaceJournalCommentDAO workspaceJournalCommentDAO;
  
  @Inject
  private WorkspaceJournalFeedbackDAO workspaceJournalFeedbackDAO;

  @TransactionAttribute(TransactionAttributeType.REQUIRED)
  public void cleanup() {

    // Simple master switch check
    
    if (!isEnabled()) {
      return;
    }
    
    // Find a student to 
    
    int removedEntries = 0;
    int removedComments = 0;
    int removedFeedback = 0;
    long ms1 = System.currentTimeMillis();
    Long userEntityId = prepareNextUser(Long.parseLong(systemSettingsController.getSetting(SETTING_USER)));
    if (userEntityId == null) {
      // No student found to process this cycle
      return;
    }
    
    // The big scary cleanup
    
    List<WorkspaceJournalEntry> entries = workspaceJournalEntryDAO.listByUserEntityId(userEntityId);
    for (WorkspaceJournalEntry entry : entries) {
      List<WorkspaceJournalComment> comments = workspaceJournalCommentDAO.listByJournalEntry(entry);
      // Comments have an optional parent, so remove from latest to oldest to avoid relation crashes 
      comments.sort(Comparator.comparing(WorkspaceJournalComment::getId).reversed());
      for (WorkspaceJournalComment comment : comments) {
        workspaceJournalCommentDAO.delete(comment);
        removedComments++;
      }
      workspaceJournalEntryDAO.delete(entry);
      removedEntries++;
    }
    // One feedback per student + course combo 
    List<WorkspaceJournalFeedback> feedbacks = workspaceJournalFeedbackDAO.listByUserEntityId(userEntityId);
    for (WorkspaceJournalFeedback feedback : feedbacks) {
      workspaceJournalFeedbackDAO.delete(feedback);
      removedFeedback++;
    }
    
    // Statistics logging

    long ms2 = System.currentTimeMillis();
    logger.info(String.format("Deleted %d entries, %d comments, and %d feedback of student %d in %dms",
        removedEntries,
        removedComments,
        removedFeedback,
        userEntityId,
        (ms2 - ms1)));
  }

  public void changeUserEntityId(Long userEntityId) {
    systemSettingsController.setSetting(SETTING_USER, Long.toString(userEntityId));   
  }

  @Override
  protected String getUserEntityIdSystemSettingKey() {
    return SETTING_USER;
  }

  @Override
  protected void toggleEnabled(boolean enabled) {
    systemSettingsController.setSetting(SETTING_ENABLED, Boolean.toString(enabled));

  }

  @Override
  protected void log(Level level, String message) {
    logger.log(level, message);
  }

  private boolean isEnabled() {
    return StringUtils.equals(systemSettingsController.getSetting(SETTING_ENABLED), Boolean.toString(true));
  }

}
