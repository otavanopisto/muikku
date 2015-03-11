package fi.muikku.plugins.assessmentrequest;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.security.Permit;
import fi.muikku.security.PermitContext;

@Dependent
public class AssessmentRequestController {

  @Inject
  private AssessmentRequestDAO assessmentRequestDAO;
  
  @Inject
  private CommunicatorAssessmentRequestController communicatorAssessmentRequestController;
  
  @Permit (AssessmentRequestPermissions.CREATE_WORKSPACE_ASSESSMENTREQUEST)
  public AssessmentRequest create(@PermitContext WorkspaceEntity workspaceEntity, UserEntity student, Date date, String message) {
    return assessmentRequestDAO.create(workspaceEntity, student, date, message, AssessmentRequestState.PENDING);
  }

  public AssessmentRequest findById(Long id) {
    return assessmentRequestDAO.findById(id);
  }
  
  public void cancelAssessmentRequest(AssessmentRequest assessmentRequest) {
    assessmentRequestDAO.updateState(assessmentRequest, AssessmentRequestState.CANCELED);
    communicatorAssessmentRequestController.sendAssessmentRequestCancelledMessage(assessmentRequest);
  }
  
  @Permit (AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS)
  public List<AssessmentRequest> listByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) {
    return assessmentRequestDAO.listByWorkspace(workspaceEntity);
  }
  
  public void requestAssessment(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    AssessmentRequest assessmentRequest = this.create(workspaceEntity, student, new Date(), message);
    List<AssessmentRequest> oldAssessmentRequests = this.listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntity.getId(), student.getId());
    AssessmentRequest oldAssessmentRequest = oldAssessmentRequests.get(oldAssessmentRequests.size() - 1);
    if(oldAssessmentRequest.getCommunicatorMessageId() == null){
      CommunicatorMessage msg = communicatorAssessmentRequestController.sendAssessmentRequestMessage(assessmentRequest);
      assessmentRequestDAO.updateMessageId(assessmentRequest, msg.getCommunicatorMessageId().getId());
    }else{
      assessmentRequest = assessmentRequestDAO.updateMessageId(assessmentRequest, oldAssessmentRequest.getCommunicatorMessageId());
      communicatorAssessmentRequestController.sendAssessmentRequestMessage(assessmentRequest);
    }

  }

  public List<AssessmentRequest> listByWorkspaceIdAndStudentIdOrderByCreated(
      Long workspaceEntityId,
      Long studentEntityId) {
    return assessmentRequestDAO.listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntityId, studentEntityId);
  }
  
  public WorkspaceAssessmentState getWorkspaceAssessmentState(
     WorkspaceEntity workspaceEntity,
     UserEntity studentEntity) {
    List<AssessmentRequest> assessmentRequests = listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntity.getId(), studentEntity.getId());
    if (assessmentRequests.isEmpty()) {
      return WorkspaceAssessmentState.UNASSESSED;
    } else {
      return WorkspaceAssessmentState.fromAssessmentRequestState(assessmentRequests.get(0).getState());
    }
  }
}
