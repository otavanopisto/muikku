package fi.muikku.plugins.assessmentrequest;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.communicator.CommunicatorController;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.WorkspaceAssessment;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

@Dependent
public class AssessmentRequestController {

  @Inject
  private AssessmentRequestMessageIdDAO assessmentRequestMessageIdDAO;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private GradingController gradingController;

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, String requestText) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    String dataSource = workspaceUserEntity.getWorkspaceEntity().getDataSource().getIdentifier();
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    return gradingController.createWorkspaceAssessmentRequest(
        dataSource, 
        workspaceUserEntity.getIdentifier(), 
        dataSource, 
        workspaceEntity.getIdentifier(), 
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(), 
        requestText, 
        new Date());
  }
  
  
  @Permit (AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS)
  public List<WorkspaceAssessmentRequest> listByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier());
  }

  public List<WorkspaceAssessmentRequest> listByWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    List<WorkspaceAssessmentRequest> workspaceAssessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    return workspaceAssessmentRequests;
  }
  
  public WorkspaceAssessmentState getWorkspaceAssessmentState(WorkspaceUserEntity workspaceUserEntity) {
    try {
      WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
      
      List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(
          workspaceEntity.getDataSource().getIdentifier(), 
          workspaceEntity.getIdentifier(),
          workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());

      if (workspaceAssessments.isEmpty()) {
        List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
            workspaceEntity.getDataSource().getIdentifier(), 
            workspaceEntity.getIdentifier(),
            workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
        
        if (assessmentRequests.isEmpty()) {
          return WorkspaceAssessmentState.UNASSESSED;
        } else {
          return WorkspaceAssessmentState.PENDING;
        }
      } else {
        WorkspaceAssessment assessment = workspaceAssessments.get(0);
        GradingScale gradingScale = gradingController.findGradingScale(
            assessment.getGradingScaleSchoolDataSource(), 
            assessment.getGradingScaleIdentifier());
        GradingScaleItem grade = gradingController.findGradingScaleItem(
            gradingScale, 
            assessment.getGradeSchoolDataSource(), 
            assessment.getGradeIdentifier());

        if (grade.isPassingGrade())
          return WorkspaceAssessmentState.PASS;
        else
          return WorkspaceAssessmentState.FAIL;
      }
      
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      return WorkspaceAssessmentState.UNASSESSED;
    }
  }

  public void deleteWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, String assessmentRequestId) {
    gradingController.deleteWorkspaceAssessmentRequest(
        workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource().getIdentifier(), 
        assessmentRequestId,
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
