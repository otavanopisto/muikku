package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.evaluation.EvaluationController;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
public class AssessmentRequestController {
  
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
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
  }
  
  public WorkspaceAssessmentState getWorkspaceAssessmentState(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    // List all asssessments, latest first
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    workspaceAssessments.sort(Comparator.comparing(WorkspaceAssessment::getDate).reversed());

    // List all unhandled assessment requests, latest first
    List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    if (!assessmentRequests.isEmpty()) {
      // Strip assessment requests that have been handled (TODO could be handled in Pyramus)
      for (int i = assessmentRequests.size() - 1; i >= 0; i--) {
        if (assessmentRequests.get(i).getHandled()) {
          assessmentRequests.remove(i);
        }
      }
      assessmentRequests.sort(Comparator.comparing(WorkspaceAssessmentRequest::getDate).reversed());
    }
    
    // List latest supplementation request
    UserEntity userEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    SupplementationRequest supplementationRequest = evaluationController.findLatestSupplementationRequestByStudentAndWorkspaceAndArchived(
        userEntity.getId(),
        workspaceEntity.getId(),
        Boolean.FALSE);
    
    WorkspaceAssessment latestAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    // #3927: Assessment without grade are anomalies from Pyramus so treat them as such 
    if (latestAssessment != null && (latestAssessment.getGradeIdentifier() == null || latestAssessment.getGradingScaleIdentifier() == null)) {
      latestAssessment = null;
    }
    WorkspaceAssessmentRequest latestRequest = assessmentRequests.isEmpty() ? null : assessmentRequests.get(0);
      
    // #4008: Incomplete if supplementation request exists and is newer than latest assessment or assessment request
    if (supplementationRequest != null) {
      if (latestAssessment == null || (latestAssessment != null && supplementationRequest.getRequestDate().after(latestAssessment.getDate()))) {
        if (latestRequest == null || (latestRequest != null && supplementationRequest.getRequestDate().after(latestRequest.getDate()))) {
          return new WorkspaceAssessmentState(WorkspaceAssessmentState.INCOMPLETE, supplementationRequest.getRequestDate(), supplementationRequest.getRequestText());
        }
      }
    }
    GradingScale gradingScale = null;
    GradingScaleItem grade = null;
    if (latestAssessment != null) {
      gradingScale = gradingController.findGradingScale(latestAssessment.getGradingScaleIdentifier());
      grade = gradingController.findGradingScaleItem(gradingScale, latestAssessment.getGradeIdentifier());
      
      if (gradingScale == null || grade == null) {
        latestAssessment = null;
      }
    }
    if (latestAssessment != null && (latestRequest == null || latestRequest.getDate().before(latestAssessment.getDate()))) {

      // Has assessment and no request, or the request is older
   
      return grade.isPassingGrade()
          ? new WorkspaceAssessmentState(WorkspaceAssessmentState.PASS, latestAssessment.getDate(), latestAssessment.getVerbalAssessment(), grade.getName(), latestAssessment.getDate())
          : new WorkspaceAssessmentState(WorkspaceAssessmentState.FAIL, latestAssessment.getDate(), latestAssessment.getVerbalAssessment(), grade.getName(), latestAssessment.getDate());
    }
    else if (latestRequest != null && (latestAssessment == null || latestAssessment.getDate().before(latestRequest.getDate()))) {
      // Has request and no assessment, or the assessment is older
      if (latestAssessment == null) {
        return new WorkspaceAssessmentState(WorkspaceAssessmentState.PENDING, latestRequest.getDate(), latestRequest.getRequestText());
      }
      else if (Boolean.TRUE.equals(latestAssessment.getPassing())) {
        return new WorkspaceAssessmentState(WorkspaceAssessmentState.PENDING_PASS, latestRequest.getDate(), latestRequest.getRequestText(), grade.getName(), latestAssessment.getDate());
      }
      else {
        return new WorkspaceAssessmentState(WorkspaceAssessmentState.PENDING_FAIL, latestRequest.getDate(), latestRequest.getRequestText(), grade.getName(), latestAssessment.getDate());
      }
    }
    else {
      // Has neither assessment nor request
      return new WorkspaceAssessmentState(WorkspaceAssessmentState.UNASSESSED);
    }
  }

  public void deleteWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, SchoolDataIdentifier assessmentRequestIdentifier) {
    gradingController.deleteWorkspaceAssessmentRequest(
        assessmentRequestIdentifier.getDataSource(), 
        assessmentRequestIdentifier.getIdentifier(),
        workspaceUserEntity.getWorkspaceEntity().getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
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
