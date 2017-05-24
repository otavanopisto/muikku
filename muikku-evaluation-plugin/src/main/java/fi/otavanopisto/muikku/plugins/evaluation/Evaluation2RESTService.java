package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
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

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessmentRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestSupplementationRequest;
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
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.servlet.BaseUrl;
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
  @BaseUrl
  private String baseUrl;

  @Inject
  private Logger logger;

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private CommunicatorController communicatorController;

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

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private Event<CommunicatorMessageSent> communicatorMessageSentEvent;

  @DELETE
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/evaluationdata")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Entities and identifiers
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (workspaceEntity == null || userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
    // If the workspace user has been given a graded evaluation, remove that  
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    if (workspaceAssessment != null) {
      gradingController.deleteWorkspaceAssessment(workspaceIdentifier, userIdentifier, workspaceAssessment.getIdentifier());
    }

    // If the workspace user has been given a supplementation request, remove that

    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspace(userEntityId, workspaceEntityId);
    if (supplementationRequest != null) {
      evaluationController.deleteSupplementationRequest(supplementationRequest);
    }
    
    // If student has assessment requests, restore the latest one (issue #2716)
    
    gradingController.restoreLatestAssessmentRequest(workspaceIdentifier, userIdentifier);
    
    return Response.noContent().build();
  }
  
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      // Allow students to access their own assessments
      if (!sessionController.getLoggedUserEntity().getId().equals(userEntityId)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Entities and identifiers
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (workspaceEntity == null || userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
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
      String literalEvaluation = null;
      if (userEntity != null) {
        WorkspaceMaterialReply workspaceMaterialReply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, userEntity);
        if (workspaceMaterialReply != null) {
          WorkspaceMaterialReplyState replyState = workspaceMaterialReply.getState();
          if (replyState == WorkspaceMaterialReplyState.SUBMITTED ||
              replyState == WorkspaceMaterialReplyState.PASSED ||
              replyState == WorkspaceMaterialReplyState.FAILED ||
              replyState == WorkspaceMaterialReplyState.INCOMPLETE) {
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
          literalEvaluation = workspaceMaterialEvaluation.getVerbalAssessment();
        }
        else {
          SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspaceMaterialAndArchived(
              userEntity.getId(),
              workspaceMaterial.getId(),
              Boolean.FALSE);
          if (supplementationRequest != null) {
            evaluated = supplementationRequest.getRequestDate();
            literalEvaluation = supplementationRequest.getRequestText();
          }
        }
      }
      assignments.add(new RestAssignment(workspaceMaterialEvaluationId, workspaceMaterialId, materialId, path, title, evaluable, submitted, evaluated, grade, literalEvaluation));
    }
    return Response.ok(assignments).build();
  }

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceMaterialAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {
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

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/supplementationrequest")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceSupplementationRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId) {
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
    
    // Workspace entity

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceEntity not found").build();
    }
    
    // Workspace supplementation request
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspace(userEntityId, workspaceEntityId);
    if (supplementationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // SupplementationRequest to RestSupplementationRequest
    
    RestSupplementationRequest restSupplementationRequest = new RestSupplementationRequest(
        supplementationRequest.getId(),
        supplementationRequest.getUserEntityId(),
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceMaterialId(),
        supplementationRequest.getRequestDate(),
        supplementationRequest.getRequestText());

    return Response.ok(restSupplementationRequest).build();
  }

  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/supplementationrequest")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceMaterialSupplementationRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      // Allow students to access their own supplementation requests
      if (!sessionController.getLoggedUserEntity().getId().equals(userEntityId)) {
        return Response.status(Status.FORBIDDEN).build();
      }
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
    
    // Supplementation request
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspaceMaterial(userEntityId, workspaceMaterialId);
    if (supplementationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // SupplementationRequest to RestSupplementationRequest
    
    RestSupplementationRequest restSupplementationRequest = new RestSupplementationRequest(
        supplementationRequest.getId(),
        supplementationRequest.getUserEntityId(),
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceMaterialId(),
        supplementationRequest.getRequestDate(),
        supplementationRequest.getRequestText());

    return Response.ok(restSupplementationRequest).build();
  }

  @PUT
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceMaterialAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestAssessment payload) {
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
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Entities and identifiers
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userEntity == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
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
    UserEntity assessingUserEntity = userEntityController.findUserEntityByUser(assessingUser);
    
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
    
    // Notification
    
    sendAssessmentNotification(workspaceEntity, workspaceAssessment, assessingUserEntity, userEntity, workspace, gradingScaleItem.getName());
    
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
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestAssessment payload) {
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
    
    // Create/update material assessment
    
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
    
    // Remove possible workspace assignment supplementation request
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspaceMaterialAndArchived(userEntityId, workspaceMaterialId, Boolean.FALSE);
    if (supplementationRequest != null) {
      evaluationController.deleteSupplementationRequest(supplementationRequest);
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
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/supplementationrequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceSupplementationRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, RestSupplementationRequest payload) {
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
    
    // Workspace entity

    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Workspace supplementation request
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspace(userEntityId, workspaceEntityId);

    // Create/update workspace supplementation request
    
    if (supplementationRequest == null) {
      supplementationRequest = evaluationController.createSupplementationRequest(
          payload.getUserEntityId(),
          payload.getStudentEntityId(),
          payload.getWorkspaceEntityId(),
          null,
          payload.getRequestDate(),
          payload.getRequestText());
    }
    else {
      supplementationRequest = evaluationController.updateSupplementationRequest(
          supplementationRequest,
          payload.getUserEntityId(),
          payload.getRequestDate(),
          payload.getRequestText());
    }
    
    // Delete possible workspace assessment
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    if (workspaceAssessment != null) {
      gradingController.deleteWorkspaceAssessment(workspaceIdentifier, userIdentifier, workspaceAssessment.getIdentifier());
    }

    // SupplementationRequest to RestSupplementationRequest
    
    RestSupplementationRequest restSupplementationRequest = new RestSupplementationRequest(
        supplementationRequest.getId(),
        supplementationRequest.getUserEntityId(),
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceMaterialId(),
        supplementationRequest.getRequestDate(),
        supplementationRequest.getRequestText());

    return Response.ok(restSupplementationRequest).build();
  }

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/supplementationrequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialSupplementationRequest(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestSupplementationRequest payload) {
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
    
    // Workspace material supplementation request
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspaceMaterial(userEntityId, workspaceMaterialId);

    // Create/update workspace material supplementation request
    
    if (supplementationRequest == null) {
      supplementationRequest = evaluationController.createSupplementationRequest(
          payload.getUserEntityId(),
          payload.getStudentEntityId(),
          null,
          payload.getWorkspaceMaterialId(),
          payload.getRequestDate(),
          payload.getRequestText());
    }
    else {
      supplementationRequest = evaluationController.updateSupplementationRequest(
          supplementationRequest,
          payload.getUserEntityId(),
          payload.getRequestDate(),
          payload.getRequestText());
    }
    
    // Delete possible workspace material assessment
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation != null) {
      evaluationController.deleteWorkspaceMaterialEvaluation(workspaceMaterialEvaluation);
    }

    // SupplementationRequest to RestSupplementationRequest
    
    RestSupplementationRequest restSupplementationRequest = new RestSupplementationRequest(
        supplementationRequest.getId(),
        supplementationRequest.getUserEntityId(),
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceMaterialId(),
        supplementationRequest.getRequestDate(),
        supplementationRequest.getRequestText());

    return Response.ok(restSupplementationRequest).build();
  }

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, RestAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Entities and identifiers
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userEntity == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(userEntity.getDefaultIdentifier(), userEntity.getDefaultSchoolDataSource().getIdentifier());
    
    // TODO listWorkspaceAssessments is incorrect; one student in one workspace should have one assessment at most
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, userIdentifier);
    WorkspaceAssessment workspaceAssessment = workspaceAssessments.isEmpty() ? null : workspaceAssessments.get(0);
    
    // Workspace user
    
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUserByWorkspaceAndUser(workspaceIdentifier, userIdentifier);

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessingUserEntity = userEntityController.findUserEntityByUser(assessingUser);
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);
    
    // Create/update workspace assessment
    
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
    
    // Delete workspace supplementation request (if any)
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspace(userEntity.getId(), workspaceEntity.getId());
    if (supplementationRequest != null) {
      evaluationController.deleteSupplementationRequest(supplementationRequest);
    }
    
    // Notification
    
    sendAssessmentNotification(workspaceEntity, workspaceAssessment, assessingUserEntity, userEntity, workspace, gradingScaleItem.getName());
    
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
      
      List<String> workspaceStudentIdentifiers = new ArrayList<String>();
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());

      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
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
          replyStates.add(WorkspaceMaterialReplyState.FAILED);
          replyStates.add(WorkspaceMaterialReplyState.PASSED);
          replyStates.add(WorkspaceMaterialReplyState.SUBMITTED);
          replyStates.add(WorkspaceMaterialReplyState.INCOMPLETE);
          assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(userEntity.getId(), replyStates, evaluatedAssignments);
        }
      }
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifierIncludeArchived(compositeAssessmentRequest.getCourseStudentIdentifier());
    UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(compositeAssessmentRequest.getUserIdentifier());
    
    // An active workspace supplementation request will override graded, passing, and evaluationDate
    
    Boolean graded = Boolean.TRUE;
    Boolean passing = compositeAssessmentRequest.getPassing();
    Date evaluationDate = compositeAssessmentRequest.getEvaluationDate();
    if (userEntity != null) {
      SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestByStudentAndWorkspaceAndArchived(
          userEntity.getId(),
          workspaceEntity.getId(),
          Boolean.FALSE);
      if (supplementationRequest != null) {
        graded = Boolean.FALSE;
        passing = Boolean.FALSE;
        evaluationDate = supplementationRequest.getRequestDate();
      }
    }
    
    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    restAssessmentRequest.setWorkspaceUserEntityId(workspaceUserEntity == null ? null : workspaceUserEntity.getId());
    restAssessmentRequest.setWorkspaceUserIdentifier(compositeAssessmentRequest.getCourseStudentIdentifier().toId());
    restAssessmentRequest.setUserEntityId(userEntity == null ? null : userEntity.getId());
    restAssessmentRequest.setAssessmentRequestDate(compositeAssessmentRequest.getAssessmentRequestDate());
    restAssessmentRequest.setEvaluationDate(evaluationDate);
    restAssessmentRequest.setPassing(passing);
    restAssessmentRequest.setGraded(graded);
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

  private void sendAssessmentNotification(WorkspaceEntity workspaceEntity, WorkspaceAssessment workspaceAssessment, UserEntity evaluator, UserEntity student, Workspace workspace, String grade) {
    String workspaceUrl = String.format("%s/workspace/%s/materials", baseUrl, workspaceEntity.getUrlName());
    Locale locale = userEntityController.getLocale(student);
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    CommunicatorMessage communicatorMessage = communicatorController.createMessage(
        communicatorController.createMessageId(),
        evaluator,
        Arrays.asList(student),
        null,
        null,
        null,
        category,
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationTitle",
            new Object[] {workspace.getName(), grade}),
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationContent",
            new Object[] {workspaceUrl, workspace.getName(), grade, workspaceAssessment.getVerbalAssessment()}),
        Collections.<Tag>emptySet());
    communicatorMessageSentEvent.fire(new CommunicatorMessageSent(communicatorMessage.getId(), student.getId(), baseUrl));
  }

}
