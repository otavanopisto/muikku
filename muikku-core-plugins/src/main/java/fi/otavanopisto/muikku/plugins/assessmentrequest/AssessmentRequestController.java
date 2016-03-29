package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestMessageId;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

@Dependent
public class AssessmentRequestController {
  
  @Inject
  private Logger logger;
  
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

  public WorkspaceAssessmentRequest findWorkspaceAssessmentRequest(SchoolDataIdentifier assessmentRequestIdentifier, SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier studentIdentifier) {
    try {
      return gradingController.findWorkspaceAssessmentRequest(assessmentRequestIdentifier.getDataSource(), 
          assessmentRequestIdentifier.getIdentifier(), 
          workspaceIdentifier.getIdentifier(), 
          studentIdentifier.getIdentifier());
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, String.format("Failed to find workspace assessment request (%s)", assessmentRequestIdentifier), e);
      return null;
    }
  }
  
  @Permit (AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS)
  public List<WorkspaceAssessmentRequest> listByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
    return gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier());
  }

  public List<WorkspaceAssessmentRequest> listByWorkspaceUser(WorkspaceUserEntity workspaceUserEntity) {
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    try {
      return gradingController.listWorkspaceAssessmentRequests(
          workspaceEntity.getDataSource().getIdentifier(), 
          workspaceEntity.getIdentifier(),
          workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      logger.log(Level.SEVERE, "Failed to list workspace assessment requests for workspace user entity %d", workspaceUserEntity.getId());
      return Collections.emptyList();
    }
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
