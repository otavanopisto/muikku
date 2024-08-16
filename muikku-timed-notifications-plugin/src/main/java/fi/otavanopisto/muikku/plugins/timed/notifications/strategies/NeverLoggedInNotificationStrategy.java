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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.timed.notifications.NeverLoggedInNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;

@Startup
@Singleton
@ApplicationScoped
public class NeverLoggedInNotificationStrategy extends AbstractTimedNotificationStrategy {

  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.neverloggedin.maxresults", "20"));
  private static final int NOTIFICATION_THRESHOLD_DAYS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.neverloggedin.notificationthreshold", "30"));
  private static final int DAYS_UNTIL_FIRST_NOTIFICATION = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.neverloggedin.daysuntilfirstnotification", "30"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.neverloggedin.checkfreq", "1800000"));
  
  @Inject
  private NeverLoggedInNotificationController neverLoggedInNotificationController;
  
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
    List<SchoolDataIdentifier> studentsToNotify = getStudentsToNotify();
    for (SchoolDataIdentifier studentIdentifier : studentsToNotify) {
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      
      if (studentEntity != null) {
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        UserEntityName studentName = userEntityController.getName(studentEntity, false);
        if (studentName == null) {
          logger.log(Level.SEVERE, String.format("Cannot send notification to student %s because name couldn't be resolved", studentIdentifier.toId()));
          continue;
        }
        List<String> guidanceCounselorMails = notificationController.listStudyCounselorsEmails(studentEntity.defaultSchoolDataIdentifier());
        String notificationContent = localeController.getText(studentLocale, "plugin.timednotifications.notification.neverloggedin.content",
            new Object[] {studentName.getDisplayNameWithLine()});
        if (CollectionUtils.isNotEmpty(guidanceCounselorMails)) {
          notificationContent = localeController.getText(studentLocale, "plugin.timednotifications.notification.neverloggedin.content.guidanceCounselor",
              new Object[] {studentName.getDisplayNameWithLine(), String.join(", ", guidanceCounselorMails)});
        }
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.neverloggedin.subject"),
          notificationContent,
          studentEntity,
          guidanceCounselorMails
        );
        neverLoggedInNotificationController.createNeverLoggedInNotification(studentIdentifier);
        activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_NEVERLOGGEDIN);
      }
      else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student %s because UserEntity was not found", studentIdentifier.toId()));
      }
      
    }
  }
  
  private Collection<Long> getGroups(){
    String groupsString = pluginSettingsController.getPluginSetting("timed-notifications", "never-logged-in-notification.groups");
    if (StringUtils.isBlank(groupsString)) {
      this.active = false;
      logger.log(Level.WARNING, "Disabling timed never logged in notifications because no groups were configured as targets");
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
  
  public List<SchoolDataIdentifier> getStudentsToNotify() {
    Collection<Long> groups = getGroups();
    if (groups.isEmpty()) {
      return Collections.emptyList();
    }

    Date thresholdDate = Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant());
    List<SchoolDataIdentifier> studentIdentifierAlreadyNotified = neverLoggedInNotificationController.listNotifiedSchoolDataIdentifiersAfter(thresholdDate);
    SearchResult searchResult = neverLoggedInNotificationController.searchActiveStudents(
        getActiveOrganizations(),
        groups,
        FIRST_RESULT + offset,
        MAX_RESULTS,
        studentIdentifierAlreadyNotified,
        thresholdDate);
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
      OffsetDateTime sendNotificationIfNotLoggedInBefore = OffsetDateTime.now().minusDays(DAYS_UNTIL_FIRST_NOTIFICATION);

      Date studyStartDate = getStudyStartDateIncludingTemporaryLeaves(result);
      if (!isUsableStudyStartDate(studyStartDate)) {
        continue;
      }
      Long userEntityId = Long.valueOf((int) result.get("userEntityId"));
      UserEntity studentEntity = userEntityController.findUserEntityById(userEntityId);
      if (studentEntity == null) {
        continue;
      }
      if (studentEntity.getLastLogin() == null && studyStartDate.before(Date.from(sendNotificationIfNotLoggedInBefore.toInstant()))) {
        studentIdentifiers.add(studentIdentifier);
      }
    }
    
    return studentIdentifiers;
  }

  private int offset = 0;
  private boolean active = true;
}
