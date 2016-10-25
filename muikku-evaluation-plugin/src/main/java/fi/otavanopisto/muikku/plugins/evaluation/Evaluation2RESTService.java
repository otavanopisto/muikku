package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessmentRequest;
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
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.CompositeAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGrade;
import fi.otavanopisto.muikku.schooldata.entity.CompositeGradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
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
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/student/{USERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceStudentAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User entity to identifier
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    if (workspaceAssessment == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    RestAssessment restAssessment = new RestAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getWorkspaceUserIdentifier().toId(),
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate());
    return Response.ok(restAssessment).build();
  }

  @PUT
  @Path("/workspace/{WORKSPACEENTITYID}/student/{USERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceStudentAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User entity to identifier
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    if (workspaceAssessment == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Workspace user
    
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);
    
    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);
    
    // Update
    
    workspaceAssessment = gradingController.updateWorkspaceAssessment(
        workspaceAssessment.getIdentifier(),
        workspaceUser,
        assessingUser,
        gradingScaleItem,
        payload.getVerbalAssessment(),
        payload.getAssessmentDate());
    
    // Back to rest
    
    RestAssessment restAssessment = new RestAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getWorkspaceUserIdentifier().toId(),
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate());
    return Response.ok(restAssessment).build();
  }

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
    List<RestAssessmentRequest> restAssessmentRequests = new ArrayList<RestAssessmentRequest>();
    SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
    List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByStaffMember(loggedUser);
    for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
      restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest));
    }
    return Response.ok(restAssessmentRequests).build();
  }
  
  private RestAssessmentRequest toRestAssessmentRequest(CompositeAssessmentRequest compositeAssessmentRequest) {
    Long assignmentsDone = 0L;
    Long assignmentsTotal = 0L;
    // Assignments total
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(compositeAssessmentRequest.getCourseIdentifier());
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
        UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(compositeAssessmentRequest.getUserIdentifier());            
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
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(compositeAssessmentRequest.getUserIdentifier());
    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    restAssessmentRequest.setUserEntityId(userEntity == null ? null : userEntity.getId());
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
