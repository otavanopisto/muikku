package fi.otavanopisto.muikku.plugins.timed.notifications.strategies;

import java.time.OffsetDateTime;
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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.evaluation.dao.SupplementationRequestDAO;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.timed.notifications.NotificationController;
import fi.otavanopisto.muikku.plugins.timed.notifications.RequestedAssessmentSupplementationsNotificationController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
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
  private GradingController gradingController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private SupplementationRequestDAO supplementationRequestDAO;
  
  @Inject
  private RequestedAssessmentSupplementationsNotificationController requestedAssessmentSupplementationsNotificationController;
  
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
    
    // Iterate through active students who belong to pre-configured groups (read: study programs)
    
    SearchResult searchResult = requestedAssessmentSupplementationsNotificationController.searchActiveStudents(getActiveOrganizations(), groups, FIRST_RESULT + offset, MAX_RESULTS);
    logger.log(Level.INFO, String.format("%s processing %d/%d", getClass().getSimpleName(), offset, searchResult.getTotalHitCount()));
    
    if ((offset + MAX_RESULTS) > searchResult.getTotalHitCount()) {
      offset = 0;
    }
    else {
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

      Date studyStartDate = getStudyStartDateIncludingTemporaryLeaves(result);
      if (!isUsableStudyStartDate(studyStartDate)) {
        // Skip if the study start date (or end of temporary leave) cannot be determined as it implies the student is not active
        continue;
      }
      
      UserEntity studentEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
      if (studentEntity == null) {
        logger.severe(String.format("UserEntity with identifier %s not found", studentIdentifier));
        continue;
      }

      // Iterate through the workspaces in which the student is currently active
      
      List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserIdentifier(studentIdentifier);
      for (WorkspaceEntity workspaceEntity : workspaceEntities) {
        
        SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
        
        // For each workspace, make sure the student hasn't been notified about it yet (i.e. don't send duplicate notifications)
        
        if (requestedAssessmentSupplementationsNotificationController.countByStudentIdentifierAndWorkspaceIdentifier(studentIdentifier, workspaceIdentifier) == 0) {

          // Skip if workspace doesn't have a supplementation request
          
          SupplementationRequest supplementationRequest = null;
          List<SupplementationRequest> supplementationRequests = supplementationRequestDAO.listByStudentAndWorkspaceAndArchived(studentEntity.getId(), workspaceEntity.getId(), Boolean.FALSE);
          if (!supplementationRequests.isEmpty()) {
            supplementationRequests.sort(Comparator.comparing(SupplementationRequest::getRequestDate).reversed());
            supplementationRequest = supplementationRequests.get(0);
          }
          if (supplementationRequest == null) {
            continue;
          }
          
          // Skip if workspace assessment is newer than supplementation request 
          
          WorkspaceAssessment workspaceAssessment = gradingController.findLatestWorkspaceAssessment(workspaceIdentifier, studentIdentifier);
          if (workspaceAssessment != null && workspaceAssessment.getDate().getTime() >= supplementationRequest.getRequestDate().getTime()) { 
            continue;
          }
          
          // Skip if assessment request is newer than supplementation request
          // TODO: At some point, refactor to simply fetch latest request by student + workspace

          WorkspaceAssessmentRequest latestAssesmentRequest = null;
          List<WorkspaceAssessmentRequest> studentAssesmentRequests = gradingController.listWorkspaceAssessmentRequests(workspaceIdentifier.getDataSource(), workspaceIdentifier.getIdentifier(), studentIdentifier.getIdentifier(), false);
          for (WorkspaceAssessmentRequest assessmentRequest : studentAssesmentRequests) {
            Date assessmentRequestDate = assessmentRequest.getDate();
            if (assessmentRequestDate != null) {
              if (latestAssesmentRequest == null || latestAssesmentRequest.getDate().before(assessmentRequestDate)) {
                latestAssesmentRequest = assessmentRequest;
              }
            }
          }
          if (latestAssesmentRequest != null && latestAssesmentRequest.getDate().getTime() >= supplementationRequest.getRequestDate().getTime()) {
            continue;
          }
          
          // Skip if supplementation request is not yet NOTIFICATION_THRESHOLD_DAYS old 
          
          if (!supplementationRequest.getRequestDate().before(Date.from(OffsetDateTime.now().minusDays(NOTIFICATION_THRESHOLD_DAYS).toInstant()))) {
            continue;
          }
          
          // If we haven't skipped so far, student needs to be notified

          Workspace workspace = workspaceController.findWorkspace(workspaceIdentifier);
          if (workspace != null) {
            String workspaceName = StringUtils.isBlank(workspace.getNameExtension()) ? workspace.getName() : String.format("%s (%s)", workspace.getName(), workspace.getNameExtension()); 
            Locale studentLocale = localeController.resolveLocale(LocaleUtils.toLocale(studentEntity.getLocale()));
            UserEntityName studentName = userEntityController.getName(studentEntity);
            if (studentName == null) {
              logger.log(Level.SEVERE, String.format("Cannot send notification to student %s because name couldn't be resolved", studentIdentifier.toId()));
              continue;
            }
            List<String> guidanceCounselorMails = notificationController.listStudyCounselorsEmails(studentEntity.defaultSchoolDataIdentifier());
            String notificationContent = localeController.getText(studentLocale, "plugin.timednotifications.notification.requestedassessmentsupplementation.content",
                new Object[] {studentName.getDisplayNameWithLine(), workspaceName});
            if (CollectionUtils.isNotEmpty(guidanceCounselorMails)) {
            notificationContent = localeController.getText(studentLocale, "plugin.timednotifications.notification.requestedassessmentsupplementation.content.guidanceCounselor",
                new Object[] {studentName.getDisplayNameWithLine(), workspaceName, String.join(", ", guidanceCounselorMails)});
            }
            notificationController.sendNotification(
              localeController.getText(studentLocale, "plugin.timednotifications.notification.requestedassessmentsupplementation.subject"),
              notificationContent,
              studentEntity,
              guidanceCounselorMails
            );
            
            // Store notification to avoid duplicates in the future
            
            requestedAssessmentSupplementationsNotificationController.createRequestedAssessmentSupplementationNotification(studentIdentifier, workspaceIdentifier);
            activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.NOTIFICATION_SUPPLEMENTATIONREQUEST);
          } else {
            logger.log(Level.SEVERE, String.format("Cannot send notification to student %s because UserEntity or workspace was not found", studentIdentifier.toId()));
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
