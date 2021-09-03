package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
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
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.timed.notifications.NeverLoggedInNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

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
  
  @Inject
  private UserController userController;
  
  @Inject 
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
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
        User student = userController.findUserByIdentifier(studentIdentifier);
        User counselor = null;
        UserEntity counselorEntity = getStudyCounselor(studentEntity.defaultSchoolDataIdentifier());
        
        if (counselorEntity != null) {
        counselor = userController.findUserByIdentifier(counselorEntity.defaultSchoolDataIdentifier());
        }
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.neverloggedin.subject"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.neverloggedin.content", new Object[] {student.getDisplayName(), counselor.getDisplayName()}),
          studentEntity,
          studentIdentifier,
          "neverloggedin"
        );
        neverLoggedInNotificationController.createNeverLoggedInNotification(studentIdentifier);
        activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_NEVERLOGGEDIN);
      } else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
      
    }
  }
  
  private UserEntity getStudyCounselor(SchoolDataIdentifier studentIdentifier){
    UserEntity guidanceCounselor = null;
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserIdentifier(studentIdentifier);
    
    // #3089: An awkward workaround to use the latest guidance group based on its identifier. Assumes a larger
    // identifier means a more recent entity. A more proper fix would be to sync group creation dates from
    // Pyramus and include them in the Elastic index. Then again, user groups would have to be refactored
    // entirely, as Pyramus handles group members as students (one study programme) while Muikku handles
    // them as user entities (all study programmes)...
    
    userGroupEntities.sort(new Comparator<UserGroupEntity>() {
      public int compare(UserGroupEntity o1, UserGroupEntity o2) {
        long l1 = NumberUtils.toLong(StringUtils.substringAfterLast(o1.getIdentifier(), "-"), -1);
        long l2 = NumberUtils.toLong(StringUtils.substringAfterLast(o2.getIdentifier(), "-"), -1);
        return (int) (l2 - l1);
      }
    });
    
    // Choose the first staff member of the first guidance group as CC recipient for the notification

    userGroupEntities:
    for (UserGroupEntity userGroupEntity : userGroupEntities) {
      UserGroup userGroup = userGroupController.findUserGroup(userGroupEntity);

      if (userGroup.getIsGuidanceGroup()) {
        List<GroupUser> groupUsers = userGroupController.listUserGroupStaffMembers(userGroup);

        for (GroupUser groupUser : groupUsers) {
          User user = userGroupController.findUserByGroupUser(groupUser);
          guidanceCounselor = userEntityController.findUserEntityByUser(user);
          break userGroupEntities;
        }
      }
    }
    return guidanceCounselor;
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
    SearchResult searchResult = neverLoggedInNotificationController.searchActiveStudentIds(getActiveOrganizations(), groups, FIRST_RESULT, MAX_RESULTS, studentIdentifierAlreadyNotified, thresholdDate);
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

      User student = userController.findUserByIdentifier(studentIdentifier);
      UserEntity studentEntity = userEntityController.findUserEntityByUser(student);
      if ((student != null) && isNotifiedStudent(student.getStudyStartDate(), student.getStudyEndDate(), OffsetDateTime.now(), NOTIFICATION_THRESHOLD_DAYS)) {

        if (studentEntity.getLastLogin() == null && student.getStudyStartDate().isAfter(sendNotificationIfNotLoggedInBefore) && student.getStudyProgrammeName().equals("Nettilukio") || student.getStudyProgrammeName().equals("Nettiperuskoulu")) {
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

  private int offset = 0;
  private boolean active = true;
}
