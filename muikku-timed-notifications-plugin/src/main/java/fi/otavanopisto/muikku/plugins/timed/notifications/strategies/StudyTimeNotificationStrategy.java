package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.time.OffsetDateTime;
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

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.StudyTimeLeftNotificationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;

@Startup
@Singleton
@ApplicationScoped
public class StudyTimeNotificationStrategy extends AbstractTimedNotificationStrategy {

  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.studytime.maxresults", "200"));
  private static final int DAYS_UNTIL_FIRST_NOTIFICATION = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.studytime.daysuntilfirstnotification", "60"));
  private static final int NOTIFICATION_THRESHOLD_DAYS_LEFT = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.studytime.notificationthreshold", "30"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.studytime.checkfreq", "15000"));//"1800000"));
  
  @Inject
  private StudyTimeLeftNotificationController studyTimeLeftNotificationController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private NotificationController notificationController;
  
  @Inject
  private Logger logger;
  
  @Inject
  private ActivityLogController activityLogController;
  
  @Override
  public boolean isActive(){
    return active;
  }
  
  @Override
  public long getDuration() {
    return NOTIFICATION_CHECK_FREQ;
  }

  @Override
  public void sendNotifications() {
    Collection<Long> groups = getGroups();
    if (groups.isEmpty()) {
      return;
    }
    
    OffsetDateTime studyTimeEndsOdt = OffsetDateTime.now().plusDays(NOTIFICATION_THRESHOLD_DAYS_LEFT);
    OffsetDateTime sendNotificationIfStudentStartedBefore = OffsetDateTime.now().minusDays(DAYS_UNTIL_FIRST_NOTIFICATION);
    Date studyTimeEnds = Date.from(studyTimeEndsOdt.toInstant());
    Date lastNotifiedThresholdDate = Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS_LEFT + 1).toInstant());
    List<SchoolDataIdentifier> studentIdentifierAlreadyNotified = studyTimeLeftNotificationController.listNotifiedSchoolDataIdentifiersAfter(lastNotifiedThresholdDate);
    SearchResult searchResult = studyTimeLeftNotificationController.searchActiveStudents(getActiveOrganizations(), groups, FIRST_RESULT + offset, MAX_RESULTS, studentIdentifierAlreadyNotified, studyTimeEnds);
    logger.log(Level.INFO, String.format("%s processing %d/%d", getClass().getSimpleName(), offset, searchResult.getTotalHitCount()));
    
    if ((offset + MAX_RESULTS) > searchResult.getTotalHitCount()) {
      offset = 0;
    } else {
      offset += MAX_RESULTS;
    }
    
    for (Map<String, Object> result : searchResult.getResults()) {
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
      
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      

      if (studentEntity != null) {
        UserEntityName studentName = userEntityController.getName(studentEntity);
        if (studentName == null) {
          logger.log(Level.SEVERE, String.format("Cannot send notification to student %s because name couldn't be resolved", studentIdentifier.toId()));
          continue;
        }
        Date studyStartDate = getDateResult(result.get("studyStartDate"));
        
        // Do not notify students that have no study start date set or have started their studies within the last 60 days
        
        if (studyStartDate == null || fromDateToOffsetDateTime(studyStartDate).isAfter(sendNotificationIfStudentStartedBefore)) {
          continue;
        }
        
        // Make sure study time end exists and falls between now and 60 days in to future
        
        OffsetDateTime studyTimeEnd = fromDateToOffsetDateTime(getDateResult(result.get("studyTimeEnd")));
        if (studyTimeEnd == null || studyTimeEnd.isAfter(studyTimeEndsOdt) || studyTimeEnd.isBefore(OffsetDateTime.now())) {
          continue;
        }

        boolean isAineopiskelu = false;
        @SuppressWarnings("unchecked")
        ArrayList<Integer> studyProgrammes = (ArrayList<Integer>) result.get("groups");
        if (studyProgrammes != null) {
          // UserGroupEntity in Muikku -> 10 maps to STUDYPROGRAMME-12 -> Aineopiskelu/peruskoulu
          // UserGroupEntity in Muikku -> 11 maps to STUDYPROGRAMME-13 -> Aineopiskelu/lukio
          isAineopiskelu = studyProgrammes.contains(10) || studyProgrammes.contains(11); 
        }
        
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        String internetixStudyTimeNotification = localeController.getText(studentLocale, "plugin.timednotifications.notification.studytime.content.internetix",
            new Object[] {studentName.getDisplayNameWithLine()});
        String studyTimeNotification = localeController.getText(studentLocale, "plugin.timednotifications.notification.studytime.content",
            new Object[] {studentName.getDisplayNameWithLine()});
        String guidanceCounselorMail = notificationController.getStudyCounselorEmail(studentEntity.defaultSchoolDataIdentifier());
        if (guidanceCounselorMail != null) {
          studyTimeNotification = localeController.getText(studentLocale, "plugin.timednotifications.notification.studytime.content.guidanceCounselor",
              new Object[] {studentName.getDisplayNameWithLine(), guidanceCounselorMail});
        }
        String notificationContent = isAineopiskelu ? internetixStudyTimeNotification : studyTimeNotification;
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.studytime.subject"),
          notificationContent,
          studentEntity,
          guidanceCounselorMail
        );
        studyTimeLeftNotificationController.createStudyTimeNotification(studentIdentifier);
        activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_STUDYTIME);
      } else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
      
    }
  }
  
  private Collection<Long> getGroups(){
    String groupsString = pluginSettingsController.getPluginSetting("timed-notifications", "study-time-notification.groups");
    if (StringUtils.isBlank(groupsString)) {
      this.active = false;
      logger.log(Level.WARNING, "Disabling timed studytime notifications because no groups were configured as targets");
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

  private int offset = 0;
  private boolean active = true;
}
