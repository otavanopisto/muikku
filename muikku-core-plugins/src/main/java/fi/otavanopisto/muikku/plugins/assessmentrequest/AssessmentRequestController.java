package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
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
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private GradingController gradingController;

  public WorkspaceAssessmentRequest createWorkspaceAssessmentRequest(WorkspaceUserEntity workspaceUserEntity, String requestText) {
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
    return gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
  }
  
  public WorkspaceAssessmentState getWorkspaceAssessmentState(WorkspaceUserEntity workspaceUserEntity) {
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
