package fi.muikku.plugins.assessmentrequest;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
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
    return assessmentRequestDAO.create(workspaceEntity, student, date, message);
  }
  
  @Permit (AssessmentRequestPermissions.LIST_WORKSPACE_ASSESSMENTREQUESTS)
  public List<AssessmentRequest> listByWorkspace(@PermitContext WorkspaceEntity workspaceEntity) {
    return assessmentRequestDAO.listByWorkspace(workspaceEntity);
  }
  
  public void requestAssessment(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    this.create(workspaceEntity, student, new Date(), message);
    communicatorAssessmentRequestController.sendAssessmentRequestMessage(workspaceEntity, student, message);
  }
}
