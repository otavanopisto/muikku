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
import fi.otavanopisto.muikku.plugins.timed.notifications.NoPassedCoursesNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

@Startup
@Singleton
@ApplicationScoped
public class NoPassedCoursesNotificationStrategy extends AbstractTimedNotificationStrategy {

  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.maxresults", "20"));
  private static final int NOTIFICATION_THRESHOLD_DAYS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.notificationthreshold", "300"));
  private static final int MIN_PASSED_COURSES_NETTILUKIO = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.mincoursesthreshold", "7"));
  private static final int MIN_PASSED_COURSES_NETTIPK = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.mincoursesthreshold", "5"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.nopassedcourses.checkfreq", "1800000"));
  
  @Inject
  private NoPassedCoursesNotificationController noPassedCoursesNotificationController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private NotificationController notificationController;
  
  @Inject
  private LocaleController localeController;
  
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
    List<SchoolDataIdentifier> studentsToNotify = getStudentsToNotify();

    for (SchoolDataIdentifier studentIdentifier : studentsToNotify) {
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      
      if (studentEntity != null) {
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.nopassedcourses.subject"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.nopassedcourses.content") +
          localeController.getText(studentLocale, "plugin.timednotifications.notification.automatedmessagefooter"),
          studentEntity,
          studentIdentifier,
          "nopassedcourses"
        );
        noPassedCoursesNotificationController.createNoPassedCoursesNotification(studentIdentifier);
        activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_NOPASSEDCOURSES);
      } else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
    }
  }
  
  public List<SchoolDataIdentifier> getStudentsToNotify() {
    Collection<Long> groups = getGroups();
    if (groups.isEmpty()) {
      return Collections.emptyList();
    }
    
    Date thresholdDate = Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant());
    List<SchoolDataIdentifier> studentIdentifierAlreadyNotified = noPassedCoursesNotificationController.listNotifiedSchoolDataIdentifiersAfter(thresholdDate);
    SearchResult searchResult = noPassedCoursesNotificationController.searchActiveStudentIds(getActiveOrganizations(), groups, FIRST_RESULT + offset, MAX_RESULTS, studentIdentifierAlreadyNotified, thresholdDate);
    logger.log(Level.INFO, String.format("%s processing %d/%d", getClass().getSimpleName(), offset, searchResult.getTotalHitCount()));
    
    if ((offset + MAX_RESULTS) > searchResult.getTotalHitCount()) {
      offset = 0;
    } else {
      offset += MAX_RESULTS;
    }
    
    List<SchoolDataIdentifier> studentIdentifiers = new ArrayList<>();
    
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
      
      User student = userController.findUserByIdentifier(studentIdentifier);
      
      if ((student != null) && isNotifiedStudent(student.getStudyStartDate(), student.getStudyEndDate(), OffsetDateTime.now(), NOTIFICATION_THRESHOLD_DAYS)) {

        boolean isNettilukio = false;
        boolean isNettipk = false;
        @SuppressWarnings("unchecked")
        ArrayList<Integer> studyProgrammes = (ArrayList<Integer>) result.get("groups");
        if (studyProgrammes != null) {
          isNettilukio = studyProgrammes.contains(5); // UserGroupEntity in Muikku -> maps to STUDYPROGRAMME-6 -> Nettilukio 
          isNettipk = studyProgrammes.contains(6); // UserGroupEntity in Muikku -> maps to STUDYPROGRAMME-7 -> Nettiperuskoulu
        }
        
        Long passedCourseCount = noPassedCoursesNotificationController.countPassedCoursesByStudentIdentifierSince(studentIdentifier, Date.from(student.getStudyStartDate().toInstant()));
        if (passedCourseCount == null) {
          logger.severe(String.format("Could not read course count for %s", studentId));
          continue;
        }
        else if ((isNettilukio && passedCourseCount < MIN_PASSED_COURSES_NETTILUKIO) || (isNettipk && passedCourseCount < MIN_PASSED_COURSES_NETTIPK)) {
          studentIdentifiers.add(studentIdentifier);
        }
      }
    }
    
    return studentIdentifiers;
  }

  public boolean isNotifiedStudent(OffsetDateTime studyStartDate, OffsetDateTime studyEndDate, OffsetDateTime currentDateTime, int thresholdDays) {
    if ((studyStartDate == null) || (studyEndDate != null))
      return false;
    
    // Earliest point when student may receive the notification is study start date + threshold day count
    OffsetDateTime thresholdDateTime = studyStartDate.plusDays(thresholdDays);
    
    // Furthest point to receive the notification is studyStartDate + thresholdDays + 30 (1 month)
    OffsetDateTime maxThresholdDateTime = studyStartDate.plusDays(thresholdDays + 30);

    // If the threshold date has passed the student is valid target for the notification
    return thresholdDateTime.isBefore(currentDateTime) && maxThresholdDateTime.isAfter(currentDateTime);
  }
  
  private Collection<Long> getGroups() {
    String groupsString = pluginSettingsController.getPluginSetting("timed-notifications", "no-passed-courses-notification.groups");
    if (StringUtils.isBlank(groupsString)) {
      this.active = false;
      logger.log(Level.WARNING, "Disabling timed noPassedCourses notifications because no groups were configured as targets");
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
