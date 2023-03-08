package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.ArrayList;
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
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceActivity;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
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

  public WorkspaceAssessmentState getWorkspaceAssessmentState(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();

    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier();

    // Ask activity with user + workspace combo

    List<WorkspaceActivity> activities = evaluationController.listWorkspaceActivities(
        userIdentifier,          // for this user only
        workspaceIdentifier,     // for this workspace only
        false,                   // no interest in transfer credits
        false);                  // no interest for assignment statistics
    if (activities.isEmpty()) {
      logger.warning(String.format("WorkspaceUserEntity %d not found in Pyramus", workspaceUserEntity.getId()));
      return new WorkspaceAssessmentState(workspaceIdentifier.getIdentifier(),WorkspaceAssessmentState.UNASSESSED);
    }
    WorkspaceActivity activity = activities.get(0);

    // Convert WorkspaceActivityState to WorkspaceAssessmentState

    String state = null;
    switch (activity.getState()) {
    case ASSESSMENT_REQUESTED:
      state = WorkspaceAssessmentState.PENDING;
      if (activity.getGrade() != null) {
        if (activity.getPassingGrade()) {
          state = WorkspaceAssessmentState.PENDING_PASS;
        }
        else {
          state = WorkspaceAssessmentState.PENDING_FAIL;
        }
      }
      break;
    case GRADED:
      if (activity.getPassingGrade()) {
        state = WorkspaceAssessmentState.PASS;
      }
      else {
        state = WorkspaceAssessmentState.FAIL;
      }
      break;
    case SUPPLEMENTATION_REQUESTED:
      state = WorkspaceAssessmentState.INCOMPLETE;
      break;
    case INTERIM_EVALUATION_REQUESTED:
      state = WorkspaceAssessmentState.INTERIM_EVALUATION_REQUEST;
      break;
    case INTERIM_EVALUATION:
      state = WorkspaceAssessmentState.INTERIM_EVALUATION;
      break;
    case ONGOING:
    case TRANSFERRED:
    default:
      state = WorkspaceAssessmentState.UNASSESSED;
      break;
    }

    // Return the state
    // TODO Refactor functionality using this method to just use WorkspaceActivity instead

    return new WorkspaceAssessmentState(
        activity.getWorkspaceSubjectIdentifier(),
        state,
        activity.getDate(),
        activity.getText(),
        activity.getGrade(),
        activity.getGradeDate(),
        activity.getPassingGrade());
  }

  public List<WorkspaceAssessmentState> getAllWorkspaceAssessmentStates(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();

    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier().schoolDataIdentifier();

    // Ask activity with user + workspace combo

    List<WorkspaceActivity> activities = evaluationController.listWorkspaceActivities(
        userIdentifier,          // for this user only
        workspaceIdentifier,     // for this workspace only
        false,                   // no interest in transfer credits
        false);                  // no interest for assignment statistics
    if (activities.isEmpty()) {
      logger.warning(String.format("WorkspaceUserEntity %d not found in Pyramus", workspaceUserEntity.getId()));
      return Collections.emptyList();
    }

    List<WorkspaceAssessmentState> assessmentStates = new ArrayList<>();

    for (WorkspaceActivity activity : activities) {
      String state = null;
      switch (activity.getState()) {
      case ASSESSMENT_REQUESTED:
        state = WorkspaceAssessmentState.PENDING;
        if (activity.getGrade() != null) {
          if (activity.getPassingGrade()) {
            state = WorkspaceAssessmentState.PENDING_PASS;
          }
          else {
            state = WorkspaceAssessmentState.PENDING_FAIL;
          }
        }
        break;
      case GRADED:
        if (activity.getPassingGrade()) {
          state = WorkspaceAssessmentState.PASS;
        }
        else {
          state = WorkspaceAssessmentState.FAIL;
        }
        break;
      case SUPPLEMENTATION_REQUESTED:
        state = WorkspaceAssessmentState.INCOMPLETE;
        break;
      case INTERIM_EVALUATION_REQUESTED:
        state = WorkspaceAssessmentState.INTERIM_EVALUATION_REQUEST;
        break;
      case INTERIM_EVALUATION:
        state = WorkspaceAssessmentState.INTERIM_EVALUATION;
        break;
      case ONGOING:
      case TRANSFERRED:
      default:
        state = WorkspaceAssessmentState.UNASSESSED;
        break;
      }

      // Return the state
      // TODO Refactor functionality using this method to just use WorkspaceActivity instead

      assessmentStates.add(new WorkspaceAssessmentState(
          activity.getWorkspaceSubjectIdentifier(),
          state,
          activity.getDate(),
          activity.getText(),
          activity.getGrade(),
          activity.getGradeDate(),
          activity.getPassingGrade()));
    }

    return assessmentStates;
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


}
