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
import org.threeten.bp.DateTimeUtils;
import org.threeten.bp.ZonedDateTime;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.jade.JadeLocaleHelper;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.RequestedAssessmentSupplementationsNotificationController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Startup
@Singleton
@ApplicationScoped
public class RequestedAssessmentSupplementationsNotificationStrategy extends AbstractTimedNotificationStrategy{

  private static final int FIRST_RESULT = 0;
  private static final int MAX_RESULTS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.requestedassessmentsupplementation.maxresults", "20"));
  private static final int NOTIFICATION_THRESHOLD_DAYS = NumberUtils.createInteger(System.getProperty("muikku.timednotifications.requestedassessmentsupplementation.notificationthreshold", "7"));
  private static final long NOTIFICATION_CHECK_FREQ = NumberUtils.createLong(System.getProperty("muikku.timednotifications.requestedassessmentsupplementation.checkfreq", "1800000"));
  
  
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
  private GradingController gradingController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private RequestedAssessmentSupplementationsNotificationController requestedAssessmentSupplementationsNotificationController;
  
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
    
    SearchResult searchResult = requestedAssessmentSupplementationsNotificationController.searchActiveStudentIds(groups, FIRST_RESULT + offset, MAX_RESULTS);
    
    if (searchResult.getFirstResult() + MAX_RESULTS >= searchResult.getTotalHitCount()) {
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
     
      List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(studentIdentifier);
      for (WorkspaceEntity workspaceEntity : workspaceEntities) {
        
        SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
        
        if (requestedAssessmentSupplementationsNotificationController.countByStudentIdentifierAndWorkspaceIdentifier(studentIdentifier, workspaceIdentifier) == 0) {
        
          List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
          
          if (workspaceAssessments != null && !workspaceAssessments.isEmpty()) {
            WorkspaceAssessment assessment = workspaceAssessments.get(0); //TODO: loop and find latest
            Date assessmentDate = assessment.getDate();
            if (assessmentDate != null && assessmentDate.before(DateTimeUtils.toDate(ZonedDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant()))) {
              GradingScale gradingScale = gradingController.findGradingScale(assessment.getGradingScaleSchoolDataSource(), assessment.getGradingScaleIdentifier());
              GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, assessment.getGradeSchoolDataSource(), assessment.getGradeIdentifier());
              
              if (!grade.isPassingGrade()) {  
                try {
                  WorkspaceAssessmentRequest latestAssesmentRequest = null;
                  List<WorkspaceAssessmentRequest> studentAssesmentRequests = gradingController.listWorkspaceAssessmentRequests(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier());
                  for (WorkspaceAssessmentRequest assessmentRequest : studentAssesmentRequests) {
                    Date assessmentRequestDate = assessmentRequest.getDate();
                    if (assessmentRequestDate != null) {
                      if (latestAssesmentRequest == null || latestAssesmentRequest.getDate().before(assessmentRequestDate)) {
                        latestAssesmentRequest = assessmentRequest;
                      }
                    }
                  }
                  
                  if (latestAssesmentRequest == null || latestAssesmentRequest.getDate().before(assessmentDate)) {
                    UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
                    Workspace workspace = workspaceController.findWorkspace(workspaceIdentifier);
                    
                    if (studentEntity != null && workspace != null) {
                      Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
                      Map<String, Object> templateModel = new HashMap<>();
                      templateModel.put("workspaceName", workspace.getName());
                      templateModel.put("locale", studentLocale);
                      templateModel.put("localeHelper", jadeLocaleHelper);
                      String notificationContent = renderNotificationTemplate("requested-assessment-supplementation-notification", templateModel);
                      notificationController.sendNotification(
                        localeController.getText(studentLocale, "plugin.timednotifications.notification.category"),
                        localeController.getText(studentLocale, "plugin.timednotifications.notification.requestedassessmentsupplementation.subject"),
                        notificationContent,
                        studentEntity
                      );
                      
                      requestedAssessmentSupplementationsNotificationController.createRequestedAssessmentSupplementationNotification(studentIdentifier, workspaceIdentifier);
                    } else {
                      logger.log(Level.SEVERE, String.format("Cannot send notification to student with identifier %s because UserEntity or workspace was not found", studentIdentifier.toId()));
                    }
                  }
                } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
                  logger.log(Level.SEVERE, "Error sending notification", e);
                }
              }
            }
          }
        }
      }
      
    }
    
  }
  
  private Collection<Long> getGroups(){
    
    String groupsString = pluginSettingsController.getPluginSetting("timed-notifications", "requested-assessment-supplementations-notification.groups");
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
