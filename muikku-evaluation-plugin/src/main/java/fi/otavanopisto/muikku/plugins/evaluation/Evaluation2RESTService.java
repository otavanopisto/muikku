package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.AssessmentRequest;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/evaluation")
@RestCatchSchoolDataExceptions
public class Evaluation2RESTService {

  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private GradingController gradingController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;

  @GET
  @Path("/assessmentRequests")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAssessmentRequests() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<AssessmentRequest> restAssessmentRequests = new ArrayList<AssessmentRequest>();
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    List<fi.otavanopisto.muikku.schooldata.entity.AssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByStaffMember(loggedUser);
    for (fi.otavanopisto.muikku.schooldata.entity.AssessmentRequest assessmentRequest : assessmentRequests) {
      restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest));
    }
    return Response.ok(restAssessmentRequests).build();
  }
  
  private AssessmentRequest toRestAssessmentRequest(fi.otavanopisto.muikku.schooldata.entity.AssessmentRequest assessmentRequest) {
    Long assignmentsDone = 0L;
    Long assignmentsTotal = 0L;
    // Assignments total
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(
        assessmentRequest.getSchoolDataSource(),
        assessmentRequest.getCourseIdentifier());
    if (workspaceEntity == null) {
      logger.severe(String.format("WorkspaceEntity not found for AssessmentRequest course %s not found", assessmentRequest.getCourseIdentifier()));
    }
    else {
      List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
          workspaceEntity,
          WorkspaceMaterialAssignmentType.EVALUATED);
      assignmentsTotal = new Long(evaluatedAssignments.size());
      // Assignments done by user
      if (assignmentsTotal > 0) {
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(
            assessmentRequest.getSchoolDataSource(),
            assessmentRequest.getUserIdentifier());
        if (userEntity == null) {
          logger.severe(String.format("UserEntity not found for AssessmentRequest student %s not found", assessmentRequest.getUserIdentifier()));
        }
        else {
          assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStateAndWorkspaceMaterials(
              userEntity.getId(),
              WorkspaceMaterialReplyState.SUBMITTED,
              evaluatedAssignments);
        }
      }
    }
    AssessmentRequest restAssessmentRequest = new AssessmentRequest();
    restAssessmentRequest.setAssessmentRequestDate(assessmentRequest.getAssessmentRequestDate());
    restAssessmentRequest.setAssignmentsDone(assignmentsDone);
    restAssessmentRequest.setAssignmentsTotal(assignmentsTotal);
    restAssessmentRequest.setEnrollmentDate(assessmentRequest.getCourseEnrollmentDate());
    restAssessmentRequest.setFirstName(assessmentRequest.getFirstName());
    restAssessmentRequest.setLastName(assessmentRequest.getLastName());
    restAssessmentRequest.setStudyProgramme(assessmentRequest.getStudyProgramme());
    restAssessmentRequest.setWorkspaceName(assessmentRequest.getCourseName());
    restAssessmentRequest.setWorkspaceNameExtension(assessmentRequest.getCourseNameExtension());
    return restAssessmentRequest;
  }

}
