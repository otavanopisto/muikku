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
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RESTAssessmentRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGrade;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGradingScale;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;
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
  @Path("/compositeGradingScales")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listGrades() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<WorkspaceGradingScale> restGradingScales = new ArrayList<WorkspaceGradingScale>();
    List<CompositeGradingScale> gradingScales = gradingController.listCompositeGradingScales();
    for (CompositeGradingScale gradingScale : gradingScales) {
      List<CompositeGrade> grades = gradingScale.getGrades(); 
      List<WorkspaceGrade> restGrades = new ArrayList<WorkspaceGrade>();
      for (CompositeGrade grade : grades) {
        restGrades.add(new WorkspaceGrade(grade.getGradeName(), grade.getGradeIdentifier(), gradingScale.getSchoolDataSource()));
      }
      restGradingScales.add(new WorkspaceGradingScale(
          gradingScale.getScaleName(),
          gradingScale.getScaleIdentifier(),
          gradingScale.getSchoolDataSource(),
          restGrades));
    }
    return Response.ok(restGradingScales).build();
  }

  @GET
  @Path("/compositeAssessmentRequests")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAssessmentRequests() {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<RESTAssessmentRequest> restAssessmentRequests = new ArrayList<RESTAssessmentRequest>();
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByStaffMember(loggedUser);
    for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
      restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest));
    }
    return Response.ok(restAssessmentRequests).build();
  }
  
  private RESTAssessmentRequest toRestAssessmentRequest(CompositeAssessmentRequest compositeAssessmentRequest) {
    Long assignmentsDone = 0L;
    Long assignmentsTotal = 0L;
    // Assignments total
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(
        compositeAssessmentRequest.getSchoolDataSource(),
        compositeAssessmentRequest.getCourseIdentifier());
    if (workspaceEntity == null) {
      logger.severe(String.format("WorkspaceEntity for course %s not found", compositeAssessmentRequest.getCourseIdentifier()));
    }
    else {
      List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
          workspaceEntity,
          WorkspaceMaterialAssignmentType.EVALUATED);
      assignmentsTotal = new Long(evaluatedAssignments.size());
      // Assignments done by user
      if (assignmentsTotal > 0) {
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(
            compositeAssessmentRequest.getSchoolDataSource(),
            compositeAssessmentRequest.getUserIdentifier());
        if (userEntity == null) {
          logger.severe(String.format("UserEntity not found for AssessmentRequest student %s not found", compositeAssessmentRequest.getUserIdentifier()));
        }
        else {
          assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStateAndWorkspaceMaterials(
              userEntity.getId(),
              WorkspaceMaterialReplyState.SUBMITTED,
              evaluatedAssignments);
        }
      }
    }
    RESTAssessmentRequest restAssessmentRequest = new RESTAssessmentRequest();
    restAssessmentRequest.setAssessmentRequestDate(compositeAssessmentRequest.getAssessmentRequestDate());
    restAssessmentRequest.setEvaluationDate(compositeAssessmentRequest.getEvaluationDate());
    restAssessmentRequest.setPassing(compositeAssessmentRequest.getPassing());
    restAssessmentRequest.setAssignmentsDone(assignmentsDone);
    restAssessmentRequest.setAssignmentsTotal(assignmentsTotal);
    restAssessmentRequest.setEnrollmentDate(compositeAssessmentRequest.getCourseEnrollmentDate());
    restAssessmentRequest.setFirstName(compositeAssessmentRequest.getFirstName());
    restAssessmentRequest.setLastName(compositeAssessmentRequest.getLastName());
    restAssessmentRequest.setStudyProgramme(compositeAssessmentRequest.getStudyProgramme());
    restAssessmentRequest.setWorkspaceEntityId(workspaceEntity == null ? null : workspaceEntity.getId());
    restAssessmentRequest.setWorkspaceName(compositeAssessmentRequest.getCourseName());
    restAssessmentRequest.setWorkspaceNameExtension(compositeAssessmentRequest.getCourseNameExtension());
    restAssessmentRequest.setWorkspaceUrlName(workspaceEntity == null ? null : workspaceEntity.getUrlName());
    return restAssessmentRequest;
  }

}
