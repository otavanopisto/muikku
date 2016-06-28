package fi.otavanopisto.muikku.plugins.timed.notifications;

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
import org.joda.time.DateTime;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.jade.JadeLocaleHelper;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;

@Startup
@Singleton
@ApplicationScoped
public class AssessmentRequestNotificationStrategy extends AbstractTimedNotificationStrategy {
  
  private static final int firstResult = 0;
  private static final int maxResults = 10;
  private static final int days = 180;
  
  @Inject
  private AssesmentRequestNotificationController assesmentRequestNotificationController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private JadeLocaleHelper jadeLocaleHelper;
  
  @Inject
  private NotificationController notificationController;
  
  @Inject
  private GradingController gradingController;
  
  @Inject
  private Logger logger;
  
  @Override
  public long getDuration() {
    return 10000l;
  }
  
  @Override
  public void sendNotifications() {
    Collection<Long> groups = Collections.singleton(1l);
    SearchResult searchResult = assesmentRequestNotificationController.searchActiveStudentIds(groups, firstResult + offset, maxResults);
    
    if (searchResult.getFirstResult() + maxResults >= searchResult.getTotalHitCount()) {
      offset = 0;
    } else {
      offset += maxResults;
    }
    
    for (SchoolDataIdentifier studentIdentifier : getStudentIdentifiersWithoutAssesmentRequests(searchResult)) {
      
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);      
      if(studentEntity != null){
        Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("locale", studentLocale);
        templateModel.put("localeHelper", jadeLocaleHelper);
        String notificationContent = renderNotificationTemplate("assessment-request-notification", templateModel);
        notificationController.sendNotification(
          localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
          localeController.getText(studentLocale, "plugin.timednotifications.notification.assesmentrequest.subject"),
          notificationContent,
          studentEntity
        );
        assesmentRequestNotificationController.createAssesmentRequestNotification(studentIdentifier);
      } else {
        logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity was not found", studentIdentifier.toId()));
      }
    }
  }
  
  private List<SchoolDataIdentifier> getStudentIdentifiersWithoutAssesmentRequests(SearchResult searchResult){
    List<SchoolDataIdentifier> studentIdentifiers = new ArrayList<>();
    Date since = new DateTime().minusDays(days).toDate();
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
      
      long notificationCount = assesmentRequestNotificationController.countAssessmentRequestNotificationsBySchoolDataIdentifierAfter(studentIdentifier, since);
      if(notificationCount == 0){
        List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listStudentAssessmentRequestsSince(studentIdentifier, since);
        
        if (assessmentRequests.isEmpty()){
          studentIdentifiers.add(studentIdentifier);
        }
      }
    }
    return studentIdentifiers;
  }
  
  private int offset = 0;

}
