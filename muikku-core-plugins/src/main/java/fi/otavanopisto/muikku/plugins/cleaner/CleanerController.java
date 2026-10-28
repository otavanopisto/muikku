package fi.otavanopisto.muikku.plugins.cleaner;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.dao.users.UserEntityDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

public abstract class CleanerController {
  
  // TODO CleanerJournalController (WorkspaceJournalEntry + WorkspaceJournalComment)
  // TODO CleanerJournalFeedbackController (WorkspaceJournalFeedback)
  // TODO CleanerEvaluationController (WorkspaceNodeEvaluation + WorkspaceNodeEvaluationAudioClip)
  // TODO CleanerActivityController (ActivityLog)

  @Inject
  private UserEntityDAO userEntityDAO;

  @Inject
  private SystemSettingsController systemSettingsController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  protected abstract String getUserEntityIdSystemSettingKey();
  
  protected abstract void toggleEnabled(boolean enabled);
  
  protected abstract void log(Level level, String message, Throwable t);
  
  protected void shutdown(Level level, String message) {
    shutdown(level, message, null);
  }

  protected void shutdown(Level level, String message, Throwable t) {
    log(level, String.format("Shutting down - %s",  message), t);
    toggleEnabled(false);
  }

  protected Long prepareNextUser(Long userEntityId) {
    
    // Our eventual return value and log variables
    
    Long nextUserId = null;
    LocalDate studyEndDate = null;

    // Get a batch of 50 users in id order, larger than the given id
    
    List<UserEntity> userEntities = userEntityDAO.listByLargerThanId(userEntityId, 50);
    
    // Start from the beginning one fine day
    
    if (userEntities.isEmpty()) {
      log(Level.INFO, "End of users reached, restarting from beginning");
      systemSettingsController.setSetting(getUserEntityIdSystemSettingKey(), "0");
      userEntities = userEntityDAO.listByLargerThanId(0L, 50);
      if (userEntities.isEmpty()) {
        shutdown(Level.SEVERE, "not finding users to process");
        return null;
      }
    }
    
    // Sort, just in case
    
    userEntities.sort(Comparator.comparing(UserEntity::getId));
    
    // Prepare Elastic
    
    SearchProvider searchProvider = getSearchProvider();
    if (searchProvider == null) {
      shutdown(Level.SEVERE, "elastic-search unavailable");
    }
    
    // Find the first student whose studies have ended over a year ago
    
    for (UserEntity userEntity : userEntities) {
      
      // Ignore non-students
      
      if (!StringUtils.startsWith(userEntity.getDefaultIdentifier(), "STUDENT-")) {
        continue;
      }
      
      // Study end date 
      
      SearchResult result = searchProvider.findUser(userEntity.defaultSchoolDataIdentifier(), true);
      if (result.getTotalHitCount() == 1) {
        Map<String, Object> match = result.getResults().get(0);
        Date d = getDateResult(match.get("studyEndDate"));
        if (d != null) {
          studyEndDate = d.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
          if (LocalDate.now().isAfter(studyEndDate.plusMonths(12))) {
            nextUserId = userEntity.getId();
            break;
          }
        }
      }
      else if (result.getTotalHitCount() > 1) {
        log(Level.WARNING, String.format("Skipping userEntity %d (%s) - multiple Elastic hits", userEntity.getId(), userEntity.getDefaultIdentifier()));
      }
      else if (result.getTotalHitCount() == 0) {
        log(Level.WARNING, String.format("Skipping userEntity %d (%s) - not found in Elastic", userEntity.getId(), userEntity.getDefaultIdentifier()));
      }
    }
    
    if (nextUserId == null) {
      Long lastUserId = userEntities.get(userEntities.size() - 1).getId();
      log(Level.INFO, String.format("No applicable students in this batch. Next batch starts from %d", lastUserId));
      systemSettingsController.setSetting(getUserEntityIdSystemSettingKey(), lastUserId.toString());
    }
    else {
      log(Level.INFO, String.format("UserEntity %d selected for cleanup, studies ended %s", nextUserId, studyEndDate.toString()));
      systemSettingsController.setSetting(getUserEntityIdSystemSettingKey(), nextUserId.toString());
    }
    
    return nextUserId;
  }

  private SearchProvider getSearchProvider() {
    return searchProviders.stream().filter(sp -> StringUtils.equals(sp.getName(), "elastic-search")).findFirst().orElse(null);
  }

  private Date getDateResult(Object value) {
    Date date = null;
    if (value instanceof Long) {
      date = new Date((Long) value);
    }
    else if (value instanceof Double) {
      // seconds to ms
      date = new Date(((Double) value).longValue() * 1000);
    }
    return date;
  }
  
  private void log(Level level, String message) {
    log(level, message, null);
  }

}
