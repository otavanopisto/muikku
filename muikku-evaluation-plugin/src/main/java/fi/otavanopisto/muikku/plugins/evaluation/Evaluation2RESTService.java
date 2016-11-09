package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessmentRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGrade;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGradingScale;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
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
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private EvaluationController evaluationController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;

  @DELETE
  @Path("/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceMaterialAssessment(@PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // User entity
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material evaluation
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    evaluationController.deleteWorkspaceMaterialEvaluation(workspaceMaterialEvaluation);
    return Response.noContent().build();
  }

  @DELETE
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceStudentAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace user entity
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User identifier
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), userSchoolDataIdentifier.getDataSource().getIdentifier());

    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    
    gradingController.deleteWorkspaceAssessment(workspaceIdentifier, userIdentifier, workspaceAssessment.getIdentifier());
    
    return Response.noContent().build();
  }

  @GET
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findWorkspaceStudentAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace user entity
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User identifier
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), userSchoolDataIdentifier.getDataSource().getIdentifier());
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    if (workspaceAssessment == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    RestAssessment restAssessment = new RestAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate(),
        workspaceAssessment.getPassing());
    return Response.ok(restAssessment).build();
  }
  
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/assignments")
  @RESTPermit(handling = Handling.INLINE)
  public Response listWorkspaceAssignments(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam("userEntityId") Long userEntityId) {
    
    // Workspace entity
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // User entity (optional)
    
    UserEntity userEntity = null;
    if (userEntityId != null) {
      userEntity = userEntityController.findUserEntityById(userEntityId);
      if (userEntity == null) {
        return Response.status(Status.NOT_FOUND).build();
      }
    }
    
    // Workspace materials...
    
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EVALUATED);
    workspaceMaterials.addAll(workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(workspaceEntity, WorkspaceMaterialAssignmentType.EXERCISE));
    
    // ...to RestAssignments
    
    List<RestAssignment> assignments = new ArrayList<RestAssignment>();
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      Long workspaceMaterialEvaluationId = null;
      Long workspaceMaterialId = workspaceMaterial.getId();
      Long materialId = workspaceMaterial.getMaterialId();
      String path = workspaceMaterial.getPath();
      String title = workspaceMaterial.getTitle();
      Boolean evaluable = workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED; 
      Date submitted = null;
      Date evaluated = null;
      String grade = null;
      if (userEntity != null) {
        WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
        if (workspaceMaterialReply != null) {
          WorkspaceMaterialReplyState replyState = workspaceMaterialReply.getState();
          if (replyState != WorkspaceMaterialReplyState.UNANSWERED && replyState != WorkspaceMaterialReplyState.WITHDRAWN) {
            submitted = workspaceMaterialReply.getLastModified();
          }
        }
        WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
        if (workspaceMaterialEvaluation != null) {
          workspaceMaterialEvaluationId = workspaceMaterialEvaluation.getId();
          evaluated = workspaceMaterialEvaluation.getEvaluated();
          GradingScale gradingScale = gradingController.findGradingScale(
              workspaceMaterialEvaluation.getGradingScaleSchoolDataSource(), workspaceMaterialEvaluation.getGradingScaleIdentifier());
          if (gradingScale != null) {
            GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(
                gradingScale, workspaceMaterialEvaluation.getGradeSchoolDataSource(), workspaceMaterialEvaluation.getGradeIdentifier());
            if (gradingScaleItem != null) {
              grade = gradingScaleItem.getName();
            }
          }
        }
      }
      assignments.add(new RestAssignment(workspaceMaterialEvaluationId, workspaceMaterialId, materialId, path, title, evaluable, submitted, evaluated, grade));
    }
    return Response.ok(assignments).build();
  }

  @GET
  @Path("/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceMaterialAssessment(@PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // User entity
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }
    
    // Workspace material evaluation
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // WorkspaceMaterialEvaluation to RestAssessment
    
    UserEntity assessingUser = userEntityController.findUserEntityById(workspaceMaterialEvaluation.getAssessorEntityId());
    String assessmentIdentifier = workspaceMaterialEvaluation.getId().toString();
    String assessingUserIdentifier = new SchoolDataIdentifier(assessingUser.getDefaultIdentifier(), assessingUser.getDefaultSchoolDataSource().getIdentifier()).toId();
    String gradingScaleIdentifier = new SchoolDataIdentifier(workspaceMaterialEvaluation.getGradingScaleIdentifier(), workspaceMaterialEvaluation.getGradingScaleSchoolDataSource()).toId();
    String gradeIdentifier = new SchoolDataIdentifier(workspaceMaterialEvaluation.getGradeIdentifier(), workspaceMaterialEvaluation.getGradeSchoolDataSource()).toId();

    RestAssessment restAssessment = new RestAssessment(
        assessmentIdentifier,
        assessingUserIdentifier,
        gradingScaleIdentifier,
        gradeIdentifier,
        workspaceMaterialEvaluation.getVerbalAssessment(),
        workspaceMaterialEvaluation.getEvaluated(),
        null); // TODO Passing grade
    return Response.ok(restAssessment).build();
  }

  @PUT
  @Path("/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceMaterialAssessment(@PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // User entity
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material evaluation
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessor = userEntityController.findUserEntityByUser(assessingUser);
    
    workspaceMaterialEvaluation = evaluationController.updateWorkspaceMaterialEvaluation(
        workspaceMaterialEvaluation,
        gradingScale,
        gradingScaleItem,
        assessor,
        payload.getAssessmentDate(),
        payload.getVerbalAssessment());

    // WorkspaceMaterialEvaluation to RestAssessment
    
    RestAssessment restAssessment = new RestAssessment(
        workspaceMaterialEvaluation.getId().toString(),
        assessorIdentifier.toId(),
        gradingScaleIdentifier.toId(),
        gradeIdentifier.toId(),
        workspaceMaterialEvaluation.getVerbalAssessment(),
        workspaceMaterialEvaluation.getEvaluated(),
        gradingScaleItem.isPassingGrade());
    return Response.ok(restAssessment).build();
  }

  @PUT
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceStudentAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace user
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User identifier
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), userSchoolDataIdentifier.getDataSource().getIdentifier());
    
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
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate(),
        workspaceAssessment.getPassing());
    return Response.ok(restAssessment).build();
  }

  @POST
  @Path("/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialAssessment(@PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // User entity
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material

    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace material evaluation
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);

    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessor = userEntityController.findUserEntityByUser(assessingUser);
    
    // Create material assessment (with update fallback, just in case)
    
    if (workspaceMaterialEvaluation == null) {
      workspaceMaterialEvaluation = evaluationController.createWorkspaceMaterialEvaluation(
          userEntity,
          workspaceMaterial,
          gradingScale,
          gradingScaleItem,
          assessor,
          payload.getAssessmentDate(),
          payload.getVerbalAssessment());
    }
    else {
      workspaceMaterialEvaluation = evaluationController.updateWorkspaceMaterialEvaluation(
          workspaceMaterialEvaluation,
          gradingScale,
          gradingScaleItem,
          assessor,
          payload.getAssessmentDate(),
          payload.getVerbalAssessment());
    }

    // WorkspaceMaterialEvaluation to RestAssessment
    
    RestAssessment restAssessment = new RestAssessment(
        workspaceMaterialEvaluation.getId().toString(),
        assessorIdentifier.toId(),
        gradingScaleIdentifier.toId(),
        gradeIdentifier.toId(),
        workspaceMaterialEvaluation.getVerbalAssessment(),
        workspaceMaterialEvaluation.getEvaluated(),
        gradingScaleItem.isPassingGrade());
    return Response.ok(restAssessment).build();
  }

  @POST
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceStudentAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Workspace user entity
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace entity to identifier
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());
    
    // User identifier
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), userSchoolDataIdentifier.getDataSource().getIdentifier());
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    
    // Workspace user
    
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);
    
    // Create (also update capability, just in case)
    
    if (workspaceAssessment == null) {
      workspaceAssessment = gradingController.createWorkspaceAssessment(
          workspaceIdentifier.getDataSource(),
          workspaceUser,
          assessingUser,
          gradingScaleItem,
          payload.getVerbalAssessment(),
          payload.getAssessmentDate());
    }
    else {
      workspaceAssessment = gradingController.updateWorkspaceAssessment(
          workspaceAssessment.getIdentifier(),
          workspaceUser,
          assessingUser,
          gradingScaleItem,
          payload.getVerbalAssessment(),
          payload.getAssessmentDate());
    }
    
    // Back to rest
    
    RestAssessment restAssessment = new RestAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate(),
        workspaceAssessment.getPassing());
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
  public Response listAssessmentRequests(@QueryParam("workspaceEntityId") Long workspaceEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    List<RestAssessmentRequest> restAssessmentRequests = new ArrayList<RestAssessmentRequest>();
    if (workspaceEntityId == null) {

      // List assessment requests by staff member
      
      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByStaffMember(loggedUser);
      for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
        restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest));
      }
    }
    else {
      
      // List assessment requests by workspace
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.STUDENT);
      List<String> workspaceStudentIdentifiers = new ArrayList<String>();
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        workspaceStudentIdentifiers.add(workspaceUserEntity.getIdentifier());
      }
      List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByWorkspace(workspaceIdentifier, workspaceStudentIdentifiers);
      for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
        restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest));
      }
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
          List<WorkspaceMaterialReplyState> replyStates = new ArrayList<WorkspaceMaterialReplyState>();
          replyStates.add(WorkspaceMaterialReplyState.ANSWERED);
          replyStates.add(WorkspaceMaterialReplyState.FAILED);
          replyStates.add(WorkspaceMaterialReplyState.PASSED);
          replyStates.add(WorkspaceMaterialReplyState.SUBMITTED);
          assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(userEntity.getId(), replyStates, evaluatedAssignments);
        }
      }
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(compositeAssessmentRequest.getCourseStudentIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(compositeAssessmentRequest.getUserIdentifier());
    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    restAssessmentRequest.setWorkspaceUserEntityId(workspaceUserEntity == null ? null : workspaceUserEntity.getId());
    restAssessmentRequest.setWorkspaceUserIdentifier(compositeAssessmentRequest.getCourseStudentIdentifier().toId());
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
