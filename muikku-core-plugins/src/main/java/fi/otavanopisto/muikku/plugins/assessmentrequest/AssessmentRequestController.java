package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivityInfo;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
public class AssessmentRequestController {

  @Inject
  private Logger logger;

  @Inject
  private AssessmentRequestMessageIdDAO assessmentRequestMessageIdDAO;

  @Inject
  private CommunicatorController communicatorController;

  @Inject
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private GradingController gradingController;

  @Inject
  private ActivityLogController activityLogController;

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, String requestText) {
    String dataSource = workspaceUserEntity.getWorkspaceEntity().getDataSource().getIdentifier();
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();

    activityLogController.createActivityLog(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().getId(), ActivityLogType.EVALUATION_REQUESTED, workspaceEntity.getId(), null);

    return gradingController.createWorkspaceAssessmentRequest(
        dataSource,
        workspaceUserEntity.getIdentifier(),
        dataSource,
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(),
        requestText,
        new Date());
  }

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(SchoolDataIdentifier assessmentRequestIdentifier, SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier) {
    return gradingController.findWorkspaceAssessmentRequest(assessmentRequestIdentifier.getDataSource(),
        assessmentRequestIdentifier.getIdentifier(),
        workspaceIdentifier.getIdentifier(),
        studentIdentifier.getIdentifier());
  }
  
  public WorkspaceAssessmentRequest findLatestAssessmentRequestByWorkspaceAndStudent(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier) {
    return gradingController.findLatestAssessmentRequestByWorkspaceAndStudent(studentIdentifier, workspaceIdentifier);
  }

  public List<WorkspaceAssessmentRequest> listByWorkspace(WorkspaceEntity workspaceEntity) {
    return gradingController.listWorkspaceAssessmentRequests(workspaceEntity.getDataSource().getIdentifier(), workspaceEntity.getIdentifier());
  }

  public List<WorkspaceAssessmentRequest> listByWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity.getDataSource().getIdentifier() == null) {
    	return null;
    }
    return gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(),
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(),
        false);
  }

  public List<WorkspaceAssessmentState> getAllWorkspaceAssessmentStates(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();

    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier();

    // Ask activity with user + workspace combo

    WorkspaceActivityInfo activityInfo = evaluationController.listWorkspaceActivities(
        userIdentifier,          // for this user only
        workspaceIdentifier,     // for this workspace only
        false,                   // no interest in transfer credits
        false);                  // no interest for assignment statistics
    if (activityInfo.getActivities().isEmpty()) {
      logger.warning(String.format("WorkspaceUserEntity %d not found in Pyramus", workspaceUserEntity.getId()));
      return Collections.emptyList();
    }
    else if (activityInfo.getActivities().size() > 1) {
      logger.warning(String.format("Workspace %s resolves to multiple activity items", workspaceIdentifier));
    }
    return activityInfo.getActivities().get(0).getAssessmentStates();
  }

  public void deleteWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, SchoolDataIdentifier assessmentRequestIdentifier) {
    gradingController.deleteWorkspaceAssessmentRequest(
        assessmentRequestIdentifier.getDataSource(),
        assessmentRequestIdentifier.getIdentifier(),
        workspaceUserEntity.getWorkspaceEntity().getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
  }
  
  public WorkspaceAssessmentRequest archiveWorkspaceAssessmentRequest(WorkspaceAssessmentRequest assessmentRequest, WorkspaceEntity workspaceEntity, UserEntity studentEntity) {
    return gradingController.updateWorkspaceAssessmentRequest(assessmentRequest.getSchoolDataSource(), assessmentRequest.getIdentifier(), assessmentRequest.getWorkspaceUserIdentifier(), assessmentRequest.getWorkspaceUserSchoolDataSource(), workspaceEntity.getIdentifier(), studentEntity.getDefaultIdentifier(), assessmentRequest.getRequestText(), assessmentRequest.getDate(), true , assessmentRequest.getHandled());
  }

  public CommunicatorMessageId findCommunicatorMessageId(WorkspaceUserEntity workspaceUserEntity) {
    AssessmentRequestMessageId assessmentRequestMessageId = assessmentRequestMessageIdDAO.findByWorkspaceUser(workspaceUserEntity);

    if (assessmentRequestMessageId != null)
      return communicatorController.findCommunicatorMessageId(assessmentRequestMessageId.getCommunicatorMessageId());
    else
      return null;
  }


  public void setCommunicatorMessageId(WorkspaceAssessmentRequest assessmentRequest,
      CommunicatorMessageId communicatorMessageId) {

    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(
        assessmentRequest.getWorkspaceUserIdentifier(),
        assessmentRequest.getWorkspaceUserSchoolDataSource());
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);

    AssessmentRequestMessageId requestMessageId = assessmentRequestMessageIdDAO.findByWorkspaceUser(workspaceUserEntity);

    if (requestMessageId == null)
      assessmentRequestMessageIdDAO.create(workspaceUserEntity, communicatorMessageId);
    else
      assessmentRequestMessageIdDAO.updateMessageId(requestMessageId, communicatorMessageId);
  }
  
  public AssessmentRequestRESTModel restModel(WorkspaceAssessmentRequest workspaceAssessmentRequest) {

    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(
        workspaceAssessmentRequest.getWorkspaceUserIdentifier(),
        workspaceAssessmentRequest.getWorkspaceUserSchoolDataSource());

    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    if (workspaceUserEntity != null) {
      SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(), 
          workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier());
      SchoolDataIdentifier workspaceAssessmentRequestIdentifier = new SchoolDataIdentifier(
          workspaceAssessmentRequest.getIdentifier(), workspaceAssessmentRequest.getSchoolDataSource());
      WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
      UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
      
      AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel(
          workspaceAssessmentRequestIdentifier.toId(), 
          userIdentifier.toId(),
          workspaceUserIdentifier.toId(),
          workspaceEntity.getId(), 
          userEntity.getId(), 
          workspaceAssessmentRequest.getRequestText(), 
          workspaceAssessmentRequest.getDate(),
          workspaceAssessmentRequest.getLocked());
  
      return restAssessmentRequest;
    }
    return null;
  }


}
