package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
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
import fi.otavanopisto.muikku.jade.JadeLocaleHelper;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.NoPassedCoursesNotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;

@Startup
@Singleton
@ApplicationScoped
public class NoPassedCoursesNotificationStrategy extends AbstractTimedNotificationStrategy{

  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.maxresults", "20"));
  private static final int NOTIFICATION_THRESHOLD_DAYS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.notificationthreshold", "300"));
  private static final int MIN_PASSED_COURSES = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.nopassedcourses.notificationthreshold", "5"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.nopassedcourses.checkfreq", "1800000"));
  
  @Inject
  private NoPassedCoursesNotificationController noPassedCoursesNotificationController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private NotificationController notificationController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private JadeLocaleHelper jadeLocaleHelper;
  
  @Inject
  private Logger logger;
  
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
    
    Date since = Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant());
    List<SchoolDataIdentifier> studentIdentifierAlreadyNotified = noPassedCoursesNotificationController.listNotifiedSchoolDataIdentifiersAfter(since);
    SearchResult searchResult = noPassedCoursesNotificationController.searchActiveStudentIds(groups, FIRST_RESULT + offset, MAX_RESULTS, studentIdentifierAlreadyNotified, since);
    
    if (searchResult.getFirstResult() + MAX_RESULTS >= searchResult.getTotalHitCount()) {
      offset = 0;
    } else {
      offset += MAX_RESULTS;
    }
    
    for (SchoolDataIdentifier studentIdentifier : getStudentIdentifiersWithoutPassedCourses(searchResult, since)) {
      
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      
      if (studentEntity != null) {
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("locale", studentLocale);
        templateModel.put("localeHelper", jadeLocaleHelper);
        String notificationContent = renderNotificationTemplate("no-passed-courses-notification", templateModel);
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.nopassedcourses.subject"),
          notificationContent,
          studentEntity
        );
        noPassedCoursesNotificationController.createNoPassedCoursesNotification(studentIdentifier);
      } else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
    }
    
  }
  
  private List<SchoolDataIdentifier> getStudentIdentifiersWithoutPassedCourses(SearchResult searchResult, Date since){
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
     
      if (noPassedCoursesNotificationController.countPassedCoursesByStudentIdentifierSince(studentIdentifier, since) < MIN_PASSED_COURSES) {
        studentIdentifiers.add(studentIdentifier);
      }
      
    }
    return studentIdentifiers;
  }
  
  private Collection<Long> getGroups(){
    
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
