package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.timed.notifications.AssesmentRequestNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Startup
@Singleton
@ApplicationScoped
public class AssessmentRequestNotificationStrategy extends AbstractTimedNotificationStrategy {
  
  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.assesmentrequest.maxresults", "20"));
  private static final int NOTIFICATION_THRESHOLD_DAYS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.assesmentrequest.notificationthreshold", "60"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.assesmentrequest.checkfreq", "1800000"));
  
  @Inject
  private AssesmentRequestNotificationController assesmentRequestNotificationController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private NotificationController notificationController;
  
  @Inject
  private GradingController gradingController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private ActivityLogController activityLogController;
  
  @Override
  public long getDuration() {
    return NOTIFICATION_CHECK_FREQ;
  }
  
  @Override
  public boolean isActive(){
    return active;
  }
  
  @Override
  public void sendNotifications() {
    Collection<Long> groups = getGroups();
    if (groups.isEmpty()) {
      return;
    }

    // #2867: Do no notify anyone that has been notified about this before (i.e. triggers only once after studies have started)
    
    List<SchoolDataIdentifier> studentIdentifiersAlreadyNotified = assesmentRequestNotificationController.listNotifiedSchoolDataIdentifiers();

    // Get a batch of students that have been studying for more than 60 days
    
    Date since = Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant());
    SearchResult searchResult = assesmentRequestNotificationController.searchActiveStudentIds(getActiveOrganizations(), groups, FIRST_RESULT + offset, MAX_RESULTS, studentIdentifiersAlreadyNotified, since);
    logger.log(Level.INFO, String.format("%s processing %d/%d", getClass().getSimpleName(), offset, searchResult.getTotalHitCount()));

    if ((offset + MAX_RESULTS) > searchResult.getTotalHitCount()) {
      offset = 0;
    } else {
      offset += MAX_RESULTS;
    }
    // #2867: Filter the batch to only contain students that have no evaluation activity whatsoever
    
    List<SchoolDataIdentifier> studentIdentifiers = getStudentIdentifiersWithoutEvaluationActivity(searchResult);
    
    // Notify the filtered list of students 
    
    for (SchoolDataIdentifier studentIdentifier : studentIdentifiers) {
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      
      if (studentEntity != null) {
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.assesmentrequest.subject"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.assesmentrequest.content") + 
          localeController.getText(studentLocale, "plugin.timednotifications.notification.automatedmessagefooter"),
          studentEntity,
          studentIdentifier,
          "assesmentrequest"
        );
        assesmentRequestNotificationController.createAssesmentRequestNotification(studentIdentifier);
        activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_ASSESMENTREQUEST);
      }
      else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
    }
  }
  
  private Collection<Long> getGroups(){
    String groupsString = pluginSettingsController.getPluginSetting("timed-notifications", "assesment-request-notification.groups");
    if (StringUtils.isBlank(groupsString)) {
      this.active = false;
      logger.log(Level.WARNING, "Disabling timed assessment request notifications because no groups were configured as targets");
      return Collections.emptyList();
    }
    
    Collection<Long> groups = new ArrayList<>();
    String[] groupSplit = groupsString.split(",");
    for (String group : groupSplit) {
      if (NumberUtils.isNumber(group)) {
        groups.add(NumberUtils.createLong(group));
      }
    }
    return groups;
  }
  
  private List<SchoolDataIdentifier> getStudentIdentifiersWithoutEvaluationActivity(SearchResult searchResult) {
    List<SchoolDataIdentifier> studentIdentifiers = new ArrayList<>();
    for (Map<String, Object> result : searchResult.getResults()) {

      // Convert the search result id into SchoolDataIdentifier. Skip student if this fails.
      
      String studentId = (String) result.get("id");
      if (StringUtils.isBlank(studentId)) {
        logger.severe("Could not process user found from search index because it had a null id");
        continue;
      }
      String[] studentIdParts = studentId.split("/", 2);
      SchoolDataIdentifier studentIdentifier = studentIdParts.length == 2 ? new SchoolDataIdentifier(studentIdParts[0], studentIdParts[1]) : null;
      if (studentIdentifier == null) {
        logger.severe(String.format("Could not process user found from search index with id %s", studentId));
        continue;
      }
      
      // Find the student by SchoolDataIdentifier
      
      User student = userController.findUserByIdentifier(studentIdentifier);
      if (student != null) {
        
        // Students without a start date (or with an end date) are never notified
        
        if (student.getStudyStartDate() == null || student.getStudyEndDate() != null) {
          continue;
        }
        
        // Students that have started their studies in the last 60 days should not be notified
        // (given searchResult should not even contain these but let's check it once more, just in case) 
        
        OffsetDateTime thresholdDateTime = OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS);
        if (student.getStudyStartDate().isAfter(thresholdDateTime)) {
          logger.severe(String.format("Skipping student id %s that just started studies", studentId));
          continue;
        }
      
        // Check if student has made any assessment requests. If they have, they don't need to be notified
  
        WorkspaceAssessmentRequest latestRequest = gradingController.findLatestAssessmentRequestByIdentifier(studentIdentifier);
        if (latestRequest != null) {
          continue;
        }
        
        // Check if student has any workspace assessments. If they have, they don't need to be notified
        
        WorkspaceAssessment latestAssessment = gradingController.findLatestWorkspaceAssessmentByIdentifier(studentIdentifier);
        if (latestAssessment != null) {
          continue;
        }
        
        // By this point, we can be certain that the student has to be notified
        
        studentIdentifiers.add(studentIdentifier);
      }
    }
    return studentIdentifiers;
  }
  
  private int offset = 0;
  private boolean active = true;

}
