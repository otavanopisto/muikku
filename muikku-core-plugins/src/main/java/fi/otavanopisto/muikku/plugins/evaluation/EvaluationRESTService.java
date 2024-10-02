package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.base.BooleanPredicate;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.activitylog.ActivityLogController;
import fi.otavanopisto.muikku.plugins.activitylog.model.ActivityLogType;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.otavanopisto.muikku.plugins.evaluation.model.AssessmentRequestCancellation;
import fi.otavanopisto.muikku.plugins.evaluation.model.InterimEvaluationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.SupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceJournalFeedback;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationType;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessmentRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssessmentWithAudio;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluationAudioClip;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestEvaluationEvent;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestEvaluationEventType;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestInterimEvaluationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestSupplementationRequest;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestWorkspaceAssessment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestWorkspaceGrade;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestWorkspaceGradingScale;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestWorkspaceJournalFeedback;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestWorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.guider.GuiderController;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivity;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivityRestModel;
import fi.otavanopisto.muikku.plugins.pedagogy.PedagogyController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialReplyController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAssignmentType;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceRestModels;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSubjectRestModel;
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
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/evaluation")
@RestCatchSchoolDataExceptions
public class EvaluationRESTService extends PluginRESTService {

  private static final long serialVersionUID = -2380108419567067263L;
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private GradingController gradingController;
  
  @Inject
  private EvaluationController evaluationController;

  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private GuiderController guiderController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceMaterialReplyController workspaceMaterialReplyController;
  
  @Inject
  private WorkspaceRestModels workspaceRestModels;

  @Inject
  private ActivityLogController activityLogController;
  
  @Inject
  private PedagogyController pedagogyController;
  
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTID}/activity")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceStudentActivity(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTID") String studentId) {
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(studentId);
    if (studentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST)
        .entity(String.format("Malformed student identifier %s", studentId))
        .build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace entity %d", workspaceEntityId))
        .build();
    }
    
    UserEntity studentUserEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentUserEntity == null) {
      return Response.status(Status.NOT_FOUND)
          .entity(String.format("Could not find user entity for student identifier %s", studentIdentifier))
          .build();
    }
    
    if (!sessionController.getLoggedUserEntity().getId().equals(studentUserEntity.getId())) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
        if (!userController.isGuardianOfStudent(sessionController.getLoggedUser(), studentIdentifier)) {
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }

    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, studentIdentifier);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, studentIdentifier);    

    List<WorkspaceAssessmentState> assessmentStates = new ArrayList<>();
    if ((workspaceUserEntity != null) && (workspaceUserEntity.getWorkspaceUserRole().getArchetype() == WorkspaceRoleArchetype.STUDENT)) {
      assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
    }
    
    GuiderStudentWorkspaceActivityRestModel guiderStudentWorkspaceActivityRestModel = workspaceRestModels.toRestModel(activity, assessmentStates);

    return Response.ok(guiderStudentWorkspaceActivityRestModel).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/")
  @RESTPermit(handling = Handling.INLINE)
  public Response listWorkspaceMaterialEvaluations(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @QueryParam("userEntityId") Long userEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (userEntityId == null) {
      return Response.status(Status.NOT_IMPLEMENTED).entity("Listing workspace material evaluations without userEntityId is not implemented yet").build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid user entity id").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUserEntity().getId().equals(userEntity.getId())) {
      if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_LISTWORKSPACEMATERIALEVALUATIONS, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    List<fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation> result = new ArrayList<>();
    
    fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findLatestUnarchivedWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation != null) {
      result.add(workspaceMaterialEvaluation);
    }
    
    if (result.isEmpty()) {
      return Response.ok(Collections.emptyList()).build();
    }
    
    if (!workspaceMaterialEvaluation.getWorkspaceMaterialId().equals(workspaceMaterial.getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    return Response.ok(createRestModel(result.toArray(new fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation[0]))).build();
  }

  @DELETE
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/workspaceassessment/{IDENTIFIER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, @PathParam("IDENTIFIER") String identifier) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (workspaceUser == null) {
      logger.warning(String.format("Workspace user for workspaceUserEntityId %d not found", workspaceUserEntityId));
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userSchoolDataIdentifier == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceAssessmentIdentifier = SchoolDataIdentifier.fromId(identifier);
    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    SchoolDataIdentifier studentIdentifier = userSchoolDataIdentifier.schoolDataIdentifier();

    gradingController.deleteWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssessmentIdentifier);
    
    return Response.noContent().build();
  }
  
  @DELETE
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/supplementationrequest/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteSupplementationRequest(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, @PathParam("ID") Long supplementationRequestId) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserEntity studentEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestById(supplementationRequestId);
    if (supplementationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!supplementationRequest.getStudentEntityId().equals(studentEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Student mismatch").build();
    }
    if (!supplementationRequest.getWorkspaceEntityId().equals(workspaceEntity.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace mismatch").build();
    }
    evaluationController.deleteSupplementationRequest(supplementationRequest);

    return Response.noContent().build();
  }

  @GET
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/events")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceEvents(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {
    
    // Entities and access check (ACCESS_EVALUATION or own)
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserEntity studentEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      if (!sessionController.getLoggedUserEntity().getId().equals(studentEntity.getId())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    UserEntityName studentName = userEntityController.getName(studentEntity, true);
    
    // Result object
    
    List<RestEvaluationEvent> events = new ArrayList<RestEvaluationEvent>();
    
    // Cancelled assessment request
    
    List<AssessmentRequestCancellation> assessmentRequestCancellations = evaluationController.listAssessmentRequestCancellationsByStudentAndWorkspace(studentEntity.getId(), workspaceEntity.getId());
    
    for (AssessmentRequestCancellation assessmentRequestCancellation : assessmentRequestCancellations) {
        
      RestEvaluationEvent event = new RestEvaluationEvent();
      event.setWorkspaceSubjectIdentifier(null);
      event.setStudent(studentName.getDisplayName());
      event.setAuthor(studentName.getDisplayName());
      event.setDate(assessmentRequestCancellation.getCancellationDate());
      event.setIdentifier(workspaceUserEntityId.toString());
      event.setText(null);
      event.setType(RestEvaluationEventType.EVALUATION_REQUEST_CANCELLED);
      events.add(event);
    }
    
    // Grade cache
    
    Map<SchoolDataIdentifier, GradingScale> gradingScaleCache = new HashMap<>();
    Map<SchoolDataIdentifier, GradingScaleItem> gradingScaleItemCache = new HashMap<>();
    
    // Assessments
    
    List<WorkspaceAssessment> workspaceAssessments = gradingController.listWorkspaceAssessments(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
    workspaceAssessments.sort(Comparator.comparing(WorkspaceAssessment::getDate));
    Set<SchoolDataIdentifier> seenWorkspaceSubjects = new HashSet<>();
    for (WorkspaceAssessment workspaceAssessment : workspaceAssessments) {
      UserEntityName assessorName = userEntityController.getName(workspaceAssessment.getAssessingUserIdentifier(), true);
      
      // More data from Pyramus (urgh)

      SchoolDataIdentifier gradingScaleIdentifier = workspaceAssessment.getGradingScaleIdentifier();
      GradingScale gradingScale = gradingScaleCache.get(gradingScaleIdentifier);
      if (gradingScale == null) {
        gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
        gradingScaleCache.put(gradingScaleIdentifier, gradingScale);
      }
      SchoolDataIdentifier gradeIdentifier = workspaceAssessment.getGradeIdentifier();
      GradingScaleItem gradingScaleItem = gradingScaleItemCache.get(gradeIdentifier);
      if (gradingScaleItem == null) {
        gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);
        gradingScaleItemCache.put(gradeIdentifier, gradingScaleItem);
      }
      SchoolDataIdentifier workspaceSubjectIdentifier = workspaceAssessment.getWorkspaceSubjectIdentifier();
      
      // Event
      
      RestEvaluationEvent event = new RestEvaluationEvent();
      event.setWorkspaceSubjectIdentifier(workspaceSubjectIdentifier.toId());
      event.setStudent(studentName.getDisplayName());
      event.setAuthor(assessorName.getDisplayName());
      event.setDate(workspaceAssessment.getDate());
      event.setGrade(gradingScaleItem.getName());
      // TODO Why do grade and scale identifiers lack source?  
      event.setGradeIdentifier(String.format("PYRAMUS-%s@PYRAMUS-%s", gradingScale.getIdentifier(), gradingScaleItem.getIdentifier()));
      event.setIdentifier(workspaceAssessment.getIdentifier().toId());
      event.setText(workspaceAssessment.getVerbalAssessment());
      // Subsequent workspace assessments are always considered improved grades (#6213: if passing)
      if (gradingScaleItem.isPassingGrade() && seenWorkspaceSubjects.contains(workspaceAssessment.getWorkspaceSubjectIdentifier())) {
        event.setType(RestEvaluationEventType.EVALUATION_IMPROVED);
      }
      else {
        event.setType(gradingScaleItem.isPassingGrade() ? RestEvaluationEventType.EVALUATION_PASS : RestEvaluationEventType.EVALUATION_FAIL);
      }
      events.add(event);
      
      if (workspaceAssessment.getWorkspaceSubjectIdentifier() != null) {
        seenWorkspaceSubjects.add(workspaceAssessment.getWorkspaceSubjectIdentifier());
      }
    }
    
    // Supplementation requests
    
    List<SupplementationRequest> supplementationRequests = evaluationController.listSupplementationRequestsByStudentAndWorkspaceAndArchived(
        studentEntity.getId(), workspaceEntity.getId(), Boolean.FALSE);
    for (SupplementationRequest supplementationRequest : supplementationRequests) {
      UserEntity assessorEntity = userEntityController.findUserEntityById(supplementationRequest.getUserEntityId());
      UserEntityName assessorName = userEntityController.getName(assessorEntity, true);
      RestEvaluationEvent event = new RestEvaluationEvent();
      event.setWorkspaceSubjectIdentifier(supplementationRequest.getWorkspaceSubjectIdentifier());
      event.setStudent(studentName.getDisplayName());
      event.setAuthor(assessorName.getDisplayName());
      event.setDate(supplementationRequest.getRequestDate());
      event.setIdentifier(supplementationRequest.getId().toString());
      event.setText(supplementationRequest.getRequestText());
      event.setType(RestEvaluationEventType.SUPPLEMENTATION_REQUEST);
      events.add(event);
    }
    
    // Evaluation requests
    
    List<WorkspaceAssessmentRequest> assessmentRequests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(), 
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(),
        true);
    for (WorkspaceAssessmentRequest assessmentRequest : assessmentRequests) {
      RestEvaluationEvent event = new RestEvaluationEvent();
      event.setWorkspaceSubjectIdentifier(null);
      event.setStudent(studentName.getDisplayName());
      event.setAuthor(studentName.getDisplayName());
      event.setDate(assessmentRequest.getDate());
      event.setIdentifier(assessmentRequest.getIdentifier());
      event.setText(assessmentRequest.getRequestText());
      event.setType(RestEvaluationEventType.EVALUATION_REQUEST);
      events.add(event);
    }
    
    // Interim evaluation requests (including archived, as this is history data)
    
    List<InterimEvaluationRequest> interimEvaluationRequests = evaluationController.listInterimEvaluationRequests(studentEntity.getId(), workspaceEntity.getId());
    for (InterimEvaluationRequest interimEvaluationRequest : interimEvaluationRequests) {
      RestEvaluationEvent event = new RestEvaluationEvent();
      event.setWorkspaceSubjectIdentifier(null);
      event.setStudent(studentName.getDisplayName());
      event.setAuthor(studentName.getDisplayName());
      event.setDate(interimEvaluationRequest.getRequestDate());
      event.setIdentifier(interimEvaluationRequest.getId().toString());
      event.setText(interimEvaluationRequest.getRequestText());
      event.setType(RestEvaluationEventType.INTERIM_EVALUATION_REQUEST);
      events.add(event);
      if (interimEvaluationRequest.getCancellationDate() != null) {
        event = new RestEvaluationEvent();
        event.setWorkspaceSubjectIdentifier(null);
        event.setStudent(studentName.getDisplayName());
        event.setAuthor(studentName.getDisplayName());
        event.setDate(interimEvaluationRequest.getCancellationDate());
        event.setIdentifier(interimEvaluationRequest.getId().toString());
        event.setText(interimEvaluationRequest.getRequestText());
        event.setType(RestEvaluationEventType.INTERIM_EVALUATION_REQUEST_CANCELLED);
        events.add(event);
      }
    }
    
    // Interim evaluations
    
    List<WorkspaceMaterial> workspaceMaterials = workspaceMaterialController.listWorkspaceMaterialsByAssignmentType(
        workspaceEntity,
        WorkspaceMaterialAssignmentType.INTERIM_EVALUATION,
        BooleanPredicate.IGNORE);
    for (WorkspaceMaterial workspaceMaterial : workspaceMaterials) {
      WorkspaceMaterialEvaluation evaluation = evaluationController.findLatestUnarchivedWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, studentEntity);
      if (evaluation != null) {
        UserEntity assessor = userEntityController.findUserEntityById(evaluation.getAssessorEntityId());
        RestEvaluationEvent event = new RestEvaluationEvent();
        event.setWorkspaceSubjectIdentifier(null);
        event.setStudent(studentName.getDisplayName());
        event.setAuthor(userEntityController.getName(assessor, true).getDisplayName());
        event.setDate(evaluation.getEvaluated());
        event.setIdentifier(evaluation.getId().toString());
        event.setText(evaluation.getVerbalAssessment());
        event.setType(RestEvaluationEventType.INTERIM_EVALUATION);
        events.add(event);
      }
    }
    
    // Sort and return
    
    events.sort(Comparator.comparing(RestEvaluationEvent::getDate));
    return Response.ok(events).build();
  }

  @POST
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceMaterialAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, RestAssessmentWithAudio payload) {
    if (payload == null || payload.getEvaluationType() == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

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
    
    if (payload.getEvaluationType() == WorkspaceMaterialEvaluationType.ASSESSMENT && workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
      // Grade is required for evaluated assignments, but not required for exercises
      if (payload.getGradingScaleIdentifier() == null || payload.getGradeIdentifier() == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }
    }
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = payload.getGradingScaleIdentifier() != null ? SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier()) : null;
    GradingScale gradingScale = gradingScaleIdentifier != null ? gradingController.findGradingScale(gradingScaleIdentifier) : null;
    SchoolDataIdentifier gradeIdentifier = payload.getGradeIdentifier() != null ? SchoolDataIdentifier.fromId(payload.getGradeIdentifier()) : null;
    GradingScaleItem gradingScaleItem = (gradingScale != null && gradeIdentifier != null) ? gradingController.findGradingScaleItem(gradingScale, gradeIdentifier) : null;

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessor = userEntityController.findUserEntityByUser(assessingUser);
    
    // Create material assessment
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.createWorkspaceMaterialEvaluation(
        userEntity,
        workspaceMaterial,
        gradingScale,
        gradingScaleItem,
        assessor,
        payload.getAssessmentDate(),
        payload.getVerbalAssessment(),
        payload.getEvaluationType());
    
    evaluationController.synchronizeWorkspaceMaterialEvaluationAudioAssessments(workspaceMaterialEvaluation, payload.getAudioAssessments());

    // Archive related interim evaluation requests
    
    if (workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.INTERIM_EVALUATION) {
      List<InterimEvaluationRequest> requests = evaluationController.listInterimEvaluationRequests(
          userEntity,
          workspaceMaterial,
          Boolean.FALSE);
      for (InterimEvaluationRequest request : requests) {
        evaluationController.archiveInterimEvaluationRequest(request);
      }
    }

    // WorkspaceMaterialEvaluation to RestAssessment
    
    List<WorkspaceMaterialEvaluationAudioClip> evaluationAudioClips = evaluationController.listEvaluationAudioClips(workspaceMaterialEvaluation);
    List<RestAssignmentEvaluationAudioClip> audioAssessments = evaluationAudioClips.stream()
        .map(audioClip -> new RestAssignmentEvaluationAudioClip(audioClip.getClipId(), audioClip.getFileName(), audioClip.getContentType()))
        .collect(Collectors.toList());
    
    RestAssessmentWithAudio restAssessment = new RestAssessmentWithAudio(
        workspaceMaterialEvaluation.getId().toString(),
        assessorIdentifier.toId(),
        gradingScaleIdentifier != null ? gradingScaleIdentifier.toId() : null,
        gradeIdentifier != null ? gradeIdentifier.toId() : null,
        workspaceMaterialEvaluation.getVerbalAssessment(),
        workspaceMaterialEvaluation.getEvaluated(),
        gradingScaleItem != null ? gradingScaleItem.isPassingGrade() : null,
        workspaceMaterialEvaluation.getEvaluationType(),
        audioAssessments);
    return Response.ok(restAssessment).build();
  }
  
  @PUT
  @Path("/workspace/{WORKSPACEENTITYID}/user/{USERENTITYID}/workspacematerial/{WORKSPACEMATERIALID}/assessment/{ASSESSMENTID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceMaterialAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERENTITYID") Long userEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam("ASSESSMENTID") Long assessmentId, RestAssessmentWithAudio payload) {
    if (payload == null || payload.getEvaluationType() == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Validate payload
    
    if (!StringUtils.equals(payload.getIdentifier(), assessmentId.toString())) {
      return Response.status(Status.BAD_REQUEST).build();
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
    
    if (payload.getEvaluationType() == WorkspaceMaterialEvaluationType.ASSESSMENT && workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.EVALUATED) {
      // Grade is required for evaluated assignments, but not required for exercises
      if (payload.getGradingScaleIdentifier() == null || payload.getGradeIdentifier() == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }
    }
    
    // Find Workspace material evaluation for update
    
    WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluation(assessmentId);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = payload.getGradingScaleIdentifier() != null ? SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier()) : null;
    GradingScale gradingScale = gradingScaleIdentifier != null ? gradingController.findGradingScale(gradingScaleIdentifier) : null;
    SchoolDataIdentifier gradeIdentifier = payload.getGradeIdentifier() != null ? SchoolDataIdentifier.fromId(payload.getGradeIdentifier()) : null;
    GradingScaleItem gradingScaleItem = (gradingScale != null && gradeIdentifier != null) ? gradingController.findGradingScaleItem(gradingScale, gradeIdentifier) : null;

    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessor = userEntityController.findUserEntityByUser(assessingUser);
    
    // Update material assessment
    
    workspaceMaterialEvaluation = evaluationController.updateWorkspaceMaterialEvaluation(
        workspaceMaterialEvaluation,
        gradingScale,
        gradingScaleItem,
        assessor,
        payload.getAssessmentDate(),
        payload.getVerbalAssessment(),
        payload.getEvaluationType());
    
    evaluationController.synchronizeWorkspaceMaterialEvaluationAudioAssessments(workspaceMaterialEvaluation, payload.getAudioAssessments());

    // Archive related interim evaluation requests
    
    if (workspaceMaterial.getAssignmentType() == WorkspaceMaterialAssignmentType.INTERIM_EVALUATION) {
      List<InterimEvaluationRequest> requests = evaluationController.listInterimEvaluationRequests(
          userEntity,
          workspaceMaterial,
          Boolean.FALSE);
      for (InterimEvaluationRequest request : requests) {
        evaluationController.archiveInterimEvaluationRequest(request);
      }
    }

    // WorkspaceMaterialEvaluation to RestAssessment
    
    List<WorkspaceMaterialEvaluationAudioClip> evaluationAudioClips = evaluationController.listEvaluationAudioClips(workspaceMaterialEvaluation);
    List<RestAssignmentEvaluationAudioClip> audioAssessments = evaluationAudioClips.stream()
        .map(audioClip -> new RestAssignmentEvaluationAudioClip(audioClip.getClipId(), audioClip.getFileName(), audioClip.getContentType()))
        .collect(Collectors.toList());
    
    RestAssessmentWithAudio restAssessment = new RestAssessmentWithAudio(
        workspaceMaterialEvaluation.getId().toString(),
        assessorIdentifier.toId(),
        gradingScaleIdentifier != null ? gradingScaleIdentifier.toId() : null,
        gradeIdentifier != null ? gradeIdentifier.toId() : null,
        workspaceMaterialEvaluation.getVerbalAssessment(),
        workspaceMaterialEvaluation.getEvaluated(),
        gradingScaleItem != null ? gradingScaleItem.isPassingGrade() : null,
        workspaceMaterialEvaluation.getEvaluationType(),
        audioAssessments);
    return Response.ok(restAssessment).build();
  }
  
  @POST
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/supplementationrequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceSupplementationRequest(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestSupplementationRequest payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (payload.getId() != null) {
      return Response.status(Status.BAD_REQUEST).entity("POST with payload identifier").build();
    }
    if (StringUtils.isBlank(payload.getWorkspaceSubjectIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("Payload missing workspaceSubjectIdentifier").build();
    }

    SchoolDataIdentifier workspaceSubjectIdentifier = SchoolDataIdentifier.fromId(payload.getWorkspaceSubjectIdentifier());
    if (workspaceSubjectIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid workspaceSubjectIdentifier").build();
    }

    // Entities
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserEntity studentEntity = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    UserEntity userEntity = sessionController.getLoggedUserEntity();

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    
    if (workspace != null) {
      if (!workspace.getSubjects().stream().anyMatch(workspaceSubject -> workspaceSubjectIdentifier.equals(workspaceSubject.getIdentifier()))) {
        return Response.status(Status.BAD_REQUEST).entity("No such workspaceSubjectIdentifier in this workspace").build();
      }
    } else {
      return Response.status(Status.NOT_FOUND).entity("Workspace not found").build();
    }
    
    // Creation
    
    SupplementationRequest supplementationRequest = evaluationController.createSupplementationRequest(
      userEntity.getId(),
      studentEntity.getId(),
      workspaceEntity.getId(),
      workspaceSubjectIdentifier,
      payload.getRequestDate(),
      payload.getRequestText());
    
    // Notifications (evaluationController.createSupplementationRequest has already done most of them, though)

    activityLogController.createActivityLog(userEntity.getId(), ActivityLogType.EVALUATION_GOTINCOMPLETED, workspaceEntity.getId(), null);

    return Response.ok(createRestModel(supplementationRequest)).build();
  }
  
  @PUT
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/supplementationrequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceSupplementationRequest(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestSupplementationRequest payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (payload.getId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("PUT without payload identifier").build();
    }
    
    // Entities
    
    SupplementationRequest supplementationRequest = evaluationController.findSupplementationRequestById(payload.getId());
    if (supplementationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing workspaceUserEntity").build();
    }
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    // Update
    
    supplementationRequest = evaluationController.updateSupplementationRequest(supplementationRequest,
      userEntity.getId(),
      payload.getRequestDate(),
      payload.getRequestText());

    return Response.ok(createRestModel(supplementationRequest)).build();
  }

  /**
   * mApi().evaluation.interimEvaluationRequest.create(<payload>);
   * 
   * Creates a new interim evaluation request for the current user for the given workspace material.
   * 
   * Payload: Interim evaluation request with workspace material and request text.
   * 
   * {workspaceMaterialId: 123,
   *  requestText: "Interim evaluation, plz"}
   * 
   * Output: Created interim evaluation request
   *  
   * {id: 23523,
   *  userEntityId: 472389,
   *  workspaceEntityId: 34274,
   *  workspaceMaterialId: 123,
   *  requestDate: 2022-10-15T03:24:00,
   *  cancellationDate: null,
   *  requestText: "Interim evaluation, plz",
   *  archived: false}
   *  
   * Errors:
   * 400 Workspace material id not given, material not found, request text not given, workspace not found, not workspace user
   */
  @POST
  @Path("/interimEvaluationRequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateInterimEvaluationRequest(RestInterimEvaluationRequest payload) {
    
    // Payload validation
    
    if (payload.getWorkspaceMaterialId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing workspaceMaterialId").build();
    }
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(payload.getWorkspaceMaterialId());
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("WorkspaceMaterial with id %d not found", payload.getWorkspaceMaterialId())).build();
    }
    if (StringUtils.isBlank(payload.getRequestText())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing requestText").build();
    }
    WorkspaceEntity workspaceEntity = workspaceMaterialController.findWorkspaceEntityByNode(workspaceMaterial);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Unknown workspace").build();
    }
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, sessionController.getLoggedUser());
    if (workspaceUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Unknown workspace user").build();
    }
    
    // Interim evaluation request creation
    
    InterimEvaluationRequest interimEvaluationRequest = evaluationController.createInterimEvaluationRequest(payload.getWorkspaceMaterialId(), payload.getRequestText());
    return Response.ok(toRestModel(interimEvaluationRequest)).build();
  }
  
  /**
   * mApi().evaluation.workspace.interimEvaluationRequest.read(123);
   * 
   * Returns a list of all interim evaluation request for workspace 123 for the currently logged in user.
   * Note that this also returns requests even if they have been handled or cancelled (i.e. archived).
   * 
   * Output: List of all interim evaluation requests for the current user and the given workspace.
   *  
   * [{id: 23523,
   *  userEntityId: 472389,
   *  workspaceEntityId: 123,
   *  workspaceMaterialId: 42342,
   *  requestDate: 2022-10-15T03:24:00,
   *  cancellationDate: 2022-10-16T03:24:00,
   *  requestText: "Interim evaluation, plz",
   *  archived: true},
   *  ...]
   *  
   * Errors:
   * 400 Workspace with given id not found
   * 403 Trying to access interim evaluation requests of user without sufficient rights
   */
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/interimEvaluationRequests")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findInterimEvaluationRequestsByWorkspace(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam("userEntityId") Long userEntityId) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntityId != null) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_INTERIM_EVALUATION_REQUESTS) && !userEntityId.equals(userEntity.getId())) {
        return Response.status(Status.FORBIDDEN).build();
      }
      else {
        userEntity = userEntityController.findUserEntityById(userEntityId);
      }
    }
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    
    // List all interim evaluation requests of the user in the workspace
    
    List<InterimEvaluationRequest> interimEvaluationRequests = evaluationController.listInterimEvaluationRequests(
        userEntity.getId(), workspaceEntity.getId());
    
    // One material page can have several interim evaluation requests (one was made, then cancelled,
    // then another one made, etc.) Because of this, return a collection that contains only the latest
    // interim evaluation request of each page.
    
    interimEvaluationRequests.sort(Comparator.comparing(InterimEvaluationRequest::getId).reversed());
    HashMap<Long, RestInterimEvaluationRequest> restRequests = new HashMap<>();
    for (InterimEvaluationRequest interimEvaluationRequest : interimEvaluationRequests) {
      if (!restRequests.containsKey(interimEvaluationRequest.getWorkspaceMaterialId())) {
        restRequests.put(interimEvaluationRequest.getWorkspaceMaterialId(), toRestModel(interimEvaluationRequest));
      }
    }
    return Response.ok(restRequests.values()).build();
  }

  /**
   * mApi().evaluation.workspace.interimEvaluationRequest.read(123);
   * 
   * Finds the latest interim evaluation request for workspace 123 for the currently logged in user.
   * Note that this also returns the request even if it has been handled or cancelled (i.e. archived).
   * 
   * Output: Interim evaluation request
   *  
   * {id: 23523,
   *  userEntityId: 472389,
   *  workspaceEntityId: 123,
   *  workspaceMaterialId: 42342,
   *  requestDate: 2022-10-15T03:24:00,
   *  cancellationDate: 2022-10-16T03:24:00,
   *  requestText: "Interim evaluation, plz",
   *  archived: true}
   *  
   * Errors:
   * 400 Workspace with given id not found
   * 404 Latest interim evaluation request does not exist
   */
  @GET
  @Path("/workspace/{WORKSPACEENTITYID}/interimEvaluationRequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findInterimEvaluationRequestByWorkspace(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace entity %d not found", workspaceEntityId)).build();
    }
    InterimEvaluationRequest interimEvaluationRequest = evaluationController.findLatestInterimEvaluationRequest(userEntity, workspaceEntity);
    if (interimEvaluationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(toRestModel(interimEvaluationRequest)).build();
  }

  /**
   * mApi().evaluation.workspaceMaterial.interimEvaluationRequest.read(123);
   * 
   * Finds the latest interim evaluation request for workspace material 123 for the currently logged in user.
   * Note that this also returns the request even if it has been handled or cancelled (i.e. archived).
   * 
   * Output: Interim evaluation request
   *  
   * {id: 23523,
   *  userEntityId: 472389,
   *  workspaceEntityId: 42343,
   *  workspaceMaterialId: 123,
   *  requestDate: 2022-10-15T03:24:00,
   *  cancellationDate: 2022-10-16T03:24:00,
   *  requestText: "Interim evaluation, plz",
   *  archived: true}
   *  
   * Errors:
   * 400 Workspace material with given id not found
   * 404 Latest interim evaluation request does not exist
   */
  @GET
  @Path("/workspaceMaterial/{WORKSPACEMATERIALID}/interimEvaluationRequest")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response findInterimEvaluationRequestByWorkspaceMaterial(@PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @QueryParam("userEntityId") Long userEntityId) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntityId != null) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_INTERIM_EVALUATION_REQUESTS) && !userEntityId.equals(userEntity.getId())) {
        return Response.status(Status.FORBIDDEN).build();
      }
      else {
        userEntity = userEntityController.findUserEntityById(userEntityId);
      }
    }
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace material %d not found", workspaceMaterial)).build();
    }
    InterimEvaluationRequest interimEvaluationRequest = evaluationController.findLatestInterimEvaluationRequest(userEntity, workspaceMaterial);
    if (interimEvaluationRequest == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    return Response.ok(toRestModel(interimEvaluationRequest)).build();
  }

  /**
   * mApi().evaluation.interimEvaluationRequest.del(123);
   * 
   * Cancels the interim evaluation request with the given id.
   * 
   * Output: Interim evaluation request
   *  
   * {id: 123,
   *  userEntityId: 472389,
   *  workspaceEntityId: 42343,
   *  workspaceMaterialId: 5436,
   *  requestDate: 2022-10-15T03:24:00,
   *  cancellationDate: 2022-10-16T03:24:00,
   *  requestText: "Interim evaluation, plz",
   *  archived: true}
   *  
   * Errors:
   * 403 Interim evaluation request does not belong to the current user
   * 404 Interim evaluation request with id does not exist
   */
  @DELETE
  @Path("/interimEvaluationRequest/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response cancelInterimEvaluationRequestByWorkspace(@PathParam("ID") Long interimEvaluationRequestId) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    InterimEvaluationRequest interimEvaluationRequest = evaluationController.findInterimEvaluationRequestById(interimEvaluationRequestId);
    if (interimEvaluationRequest == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Interim evaluation request with id %d not found", interimEvaluationRequestId)).build();
    }
    boolean myRequest = userEntity.getId().equals(interimEvaluationRequest.getUserEntityId());
    if (!myRequest && !sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    interimEvaluationRequest = evaluationController.cancelInterimEvaluationRequest(interimEvaluationRequest, myRequest);
    
    // When an interim evaluation request is cancelled, ensure that the respective page falls back to state ANSWERED 
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(interimEvaluationRequest.getWorkspaceMaterialId());
    UserEntity requestMaker = userEntityController.findUserEntityById(interimEvaluationRequest.getUserEntityId());
    WorkspaceMaterialReply reply = workspaceMaterialReplyController.findWorkspaceMaterialReplyByWorkspaceMaterialAndUserEntity(workspaceMaterial, requestMaker);
    if (reply != null && reply.getState() == WorkspaceMaterialReplyState.SUBMITTED) {
      workspaceMaterialReplyController.updateWorkspaceMaterialReply(reply, WorkspaceMaterialReplyState.ANSWERED);
    }
        
    return Response.ok(toRestModel(interimEvaluationRequest)).build();
  }

  @POST
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestWorkspaceAssessment payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (!StringUtils.isBlank(payload.getIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("POST with payload identifier").build();
    }

    // Entities and identifiers
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (workspaceUser == null) {
      logger.warning(String.format("Workspace user for workspaceUserEntityId %d not found", workspaceUserEntityId));
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userSchoolDataIdentifier == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceIdentifier = workspaceEntity.schoolDataIdentifier();
    UserEntity studentEntity = userSchoolDataIdentifier.getUserEntity();

    // WorkspaceSubject
    
    SchoolDataIdentifier workspaceSubjectIdentifier = SchoolDataIdentifier.fromId(payload.getWorkspaceSubjectIdentifier());
    WorkspaceSubject workspaceSubject = workspace.getSubjects().stream()
      .filter(workspaceSubject_ -> workspaceSubject_.getIdentifier().equals(workspaceSubjectIdentifier))
      .findFirst()
      .orElse(null);

    if (workspaceSubject == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    UserEntity assessingUserEntity = assessingUser == null ? null : userEntityController.findUserEntityByUser(assessingUser);
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);

    // Create workspace assessment
    
    WorkspaceAssessment workspaceAssessment = gradingController.createWorkspaceAssessment(
        workspaceIdentifier.getDataSource(),
        workspaceUser,
        workspaceSubject,
        assessingUser,
        gradingScaleItem,
        payload.getVerbalAssessment(),
        payload.getAssessmentDate());
    
    // #7000: Although highly unlikely, should we have a supplementation request then mark it as handled
    
    evaluationController.markSupplementationRequestHandled(studentEntity.getId(), workspaceEntity.getId(), workspaceSubject.getIdentifier());
    
    // Notification
    
    boolean multiSubjectWorkspace = workspace.getSubjects().size() > 1;
    evaluationController.sendAssessmentNotification(workspaceEntity, workspaceSubject, workspaceAssessment, assessingUserEntity, studentEntity, workspace, gradingScaleItem.getName(), multiSubjectWorkspace);
    
    // Log workspace assessment event
    
    if (gradingScaleItem.isPassingGrade()) {
      activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.EVALUATION_GOTPASSED, workspaceEntity.getId(), null);
    }
    else {
      activityLogController.createActivityLog(studentEntity.getId(), ActivityLogType.EVALUATION_GOTFAILED, workspaceEntity.getId(), null);
    }
    
    // Back to rest
    
    RestWorkspaceAssessment restAssessment = new RestWorkspaceAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getWorkspaceSubjectIdentifier().toId(),
        workspaceAssessment.getAssessingUserIdentifier().toId(),
        workspaceAssessment.getGradingScaleIdentifier().toId(),
        workspaceAssessment.getGradeIdentifier().toId(),
        workspaceAssessment.getVerbalAssessment(),
        workspaceAssessment.getDate(),
        workspaceAssessment.getPassing());
    return Response.ok(restAssessment).build();
  }
  
  @PUT
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceAssessment(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, RestWorkspaceAssessment payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (StringUtils.isBlank(payload.getIdentifier())) {
      return Response.status(Status.BAD_REQUEST).entity("PUT without payload identifier").build();
    }

    // Entities and identifiers
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (workspaceUser == null) {
      logger.warning(String.format("Workspace user for workspaceUserEntityId %d not found", workspaceUserEntityId));
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userSchoolDataIdentifier == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    SchoolDataIdentifier workspaceAssessmentIdentifier = SchoolDataIdentifier.fromId(payload.getIdentifier());
    
    // WorkspaceSubject
    
    SchoolDataIdentifier workspaceSubjectIdentifier = SchoolDataIdentifier.fromId(payload.getWorkspaceSubjectIdentifier());
    WorkspaceSubject workspaceSubject = workspace.getSubjects().stream()
      .filter(workspaceSubject_ -> workspaceSubject_.getIdentifier().equals(workspaceSubjectIdentifier))
      .findFirst()
      .orElse(null);

    if (workspaceSubject == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Assessor
    
    SchoolDataIdentifier assessorIdentifier = SchoolDataIdentifier.fromId(payload.getAssessorIdentifier());
    User assessingUser = userController.findUserByIdentifier(assessorIdentifier);
    
    // Grade
    
    SchoolDataIdentifier gradingScaleIdentifier = SchoolDataIdentifier.fromId(payload.getGradingScaleIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(gradingScaleIdentifier);
    SchoolDataIdentifier gradeIdentifier = SchoolDataIdentifier.fromId(payload.getGradeIdentifier());
    GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(gradingScale, gradeIdentifier);

    // Update workspace assessment
    
    WorkspaceAssessment workspaceAssessment = gradingController.updateWorkspaceAssessment(
        workspaceAssessmentIdentifier,
        workspaceUser,
        workspaceSubject,
        assessingUser,
        gradingScaleItem,
        payload.getVerbalAssessment(),
        payload.getAssessmentDate());
    
    // Back to rest
    
    RestWorkspaceAssessment restAssessment = new RestWorkspaceAssessment(
        workspaceAssessment.getIdentifier().toId(),
        workspaceAssessment.getWorkspaceSubjectIdentifier().toId(),
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
    List<RestWorkspaceGradingScale> restGradingScales = new ArrayList<RestWorkspaceGradingScale>();
    List<CompositeGradingScale> gradingScales = gradingController.listCompositeGradingScales();
    for (CompositeGradingScale gradingScale : gradingScales) {
      List<CompositeGrade> grades = gradingScale.getGrades(); 
      List<RestWorkspaceGrade> restGrades = new ArrayList<RestWorkspaceGrade>();
      for (CompositeGrade grade : grades) {
        restGrades.add(new RestWorkspaceGrade(grade.getGradeName(), grade.getGradeIdentifier(), gradingScale.getSchoolDataSource()));
      }
      restGradingScales.add(new RestWorkspaceGradingScale(
          gradingScale.getScaleName(),
          gradingScale.getScaleIdentifier(),
          gradingScale.getSchoolDataSource(),
          restGrades,
          gradingScale.isActive()));
    }
    return Response.ok(restGradingScales).build();
  }

  @GET
  @Path("/compositeAssessmentRequests")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listAssessmentRequests(@QueryParam("workspaceEntityId") Long workspaceEntityId) {
    // Local Workspace cache; key is workspaceEntityId
    Map<Long, Workspace> workspaceCache = new HashMap<>();

    List<RestAssessmentRequest> restAssessmentRequests = new ArrayList<RestAssessmentRequest>();
    if (workspaceEntityId == null) {
      if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
        return Response.status(Status.FORBIDDEN).build();
      }

      // List assessment requests by staff member
      
      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByStaffMember(loggedUser);
      for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
        restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest, workspaceCache));
      }
      
      // List interim evaluation requests by staff member
      
      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listActiveWorkspaceEntitiesByUserIdentifier(loggedUser);
      List<Long> workspaceEntityIds = workspaceEntities.stream().map(workspaceEntity -> workspaceEntity.getId()).distinct().collect(Collectors.toList());
      List<InterimEvaluationRequest> interimEvaluationRequests = workspaceEntityIds.isEmpty()
          ? Collections.emptyList()
          : evaluationController.listInterimEvaluationRequests(workspaceEntityIds, Boolean.FALSE);
      for (InterimEvaluationRequest interimEvaluationRequest : interimEvaluationRequests) {
        RestAssessmentRequest request = toRestAssessmentRequest(interimEvaluationRequest, workspaceCache); 
        if (request != null) {
          restAssessmentRequests.add(request);
        }
      }
      
      // List supplementation requests by staff member
      
      for (WorkspaceEntity workspaceEntity : workspaceEntities) {
        List<SupplementationRequest> supplementationRequests = evaluationController.listSupplementationRequestsByWorkspaceAndHandledAndArchived(
            workspaceEntity.getId(),
            Boolean.FALSE,
            Boolean.FALSE);
        for (SupplementationRequest supplementationRequest : supplementationRequests) {
          RestAssessmentRequest request = toRestAssessmentRequest(supplementationRequest, workspaceCache); 
          if (request != null) {
            restAssessmentRequests.add(request);
          }
        }
      }

      Collections.sort(restAssessmentRequests, new Comparator<RestAssessmentRequest>() {
        @Override
        public int compare(RestAssessmentRequest a1, RestAssessmentRequest a2) {
          Date d1, d2;
          String[] s1 = {WorkspaceAssessmentState.INCOMPLETE, WorkspaceAssessmentState.PASS, WorkspaceAssessmentState.FAIL};
          String[] s2 = {WorkspaceAssessmentState.PENDING, WorkspaceAssessmentState.PENDING_FAIL, WorkspaceAssessmentState.PENDING_PASS, WorkspaceAssessmentState.INTERIM_EVALUATION_REQUEST};
          if (Arrays.stream(s1).anyMatch(a1.getState()::equals)) {
            d1 = a1.getEvaluationDate();
          }
          else if (Arrays.stream(s2).anyMatch(a1.getState()::equals)) {
            d1 = a1.getAssessmentRequestDate();
          }
          else {
            d1 = a1.getEnrollmentDate();
          }
          if (Arrays.stream(s1).anyMatch(a2.getState()::equals)) {
            d2 = a2.getEvaluationDate();
          }
          else if (Arrays.stream(s2).anyMatch(a2.getState()::equals)) {
            d2 = a2.getAssessmentRequestDate();
          }
          else {
            d2 = a2.getEnrollmentDate();
          }
          return d1 == null && d2 == null ? 0 : d1 == null ? -1 : d2 == null ? 1 : d1.compareTo(d2); 
        }
      });
      
    }
    else {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return Response.status(Status.NOT_FOUND).build();
      }

      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.ACCESS_WORKSPACE_EVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }

      // List assessment requests by workspace (or rather, create an evaluation card for every student in the workspace)
      
      List<String> workspaceStudentIdentifiers = new ArrayList<String>();
      List<WorkspaceUserEntity> workspaceUserEntities = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
      for (WorkspaceUserEntity workspaceUserEntity : workspaceUserEntities) {
        workspaceStudentIdentifiers.add(workspaceUserEntity.getIdentifier());
      }
      
      List<CompositeAssessmentRequest> assessmentRequests = gradingController.listAssessmentRequestsByWorkspace(workspaceEntity.schoolDataIdentifier(), workspaceStudentIdentifiers);
      for (CompositeAssessmentRequest assessmentRequest : assessmentRequests) {
        restAssessmentRequests.add(toRestAssessmentRequest(assessmentRequest, workspaceCache));
      }
      
      // List all active interim evaluation requests for the workspace, then modify the corresponding entry in the previous list
      
      List<InterimEvaluationRequest> interimEvaluationRequests = evaluationController.listInterimEvaluationRequests(workspaceEntity.getId(), Boolean.FALSE);
      for (InterimEvaluationRequest interimEvaluationRequest : interimEvaluationRequests) {
        RestAssessmentRequest restAssessmentRequest = restAssessmentRequests
            .stream()
            .filter(rar -> rar.getUserEntityId().equals(interimEvaluationRequest.getUserEntityId()))
            .findFirst()
            .orElse(null);
        if (restAssessmentRequest == null) {

          // Interesting. We have an interim evaluation request from someone who is no longer even a workspace member. I guess we can archive it.
          
          logger.warning(String.format("Archiving interim evaluation request %d: user %d in workspace %d does not match any workspace user",
              interimEvaluationRequest.getId(),
              interimEvaluationRequest.getUserEntityId(),
              workspaceEntity.getId()));
          evaluationController.archiveInterimEvaluationRequest(interimEvaluationRequest);
        }
        else if (restAssessmentRequest.getEvaluationDate() != null && restAssessmentRequest.getEvaluationDate().after(interimEvaluationRequest.getRequestDate())) {
          
          // Somewhat interesting. User has been fully evaluated before an interim evaluation request was handled. Oh well,
          // let's archive it out of the way here, then.

          logger.warning(String.format("Archiving interim evaluation request %d: user already evaluated",
              interimEvaluationRequest.getId()));
          evaluationController.archiveInterimEvaluationRequest(interimEvaluationRequest);
        }
        else if (restAssessmentRequest.getAssessmentRequestDate() != null && restAssessmentRequest.getAssessmentRequestDate().after(interimEvaluationRequest.getRequestDate())) {
            
          // Semi-interesting. User has requested full workspace evaluation after also submitting an interim evaluation request. UI should
          // prevent that but let's leave these as-is; if the user cancels full workspace evaluation, the latest state should revert back
          // to interim evaluation having been requested.
          
        }
        else {
          
          // With all afore-mentioned anomalies out of the way, the state of the user in this workspace is, indeed, interim evaluation requested 
          
          restAssessmentRequest.setId(interimEvaluationRequest.getId());
          restAssessmentRequest.setAssessmentRequestDate(interimEvaluationRequest.getRequestDate());
          restAssessmentRequest.setState(WorkspaceAssessmentState.INTERIM_EVALUATION_REQUEST);
        }
      }
      
      restAssessmentRequests.sort(Comparator.comparing(RestAssessmentRequest::getLastName).thenComparing(RestAssessmentRequest::getFirstName));
    }
    
    return Response.ok(restAssessmentRequests).build();
  }
  
  @PUT
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/assessment/{ASSESSMENTREQUESTIDENTIFIER}/lock")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleAssessmentRequestLock(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId, @PathParam("ASSESSMENTREQUESTIDENTIFIER") String assessmentRequestId, RestAssessmentRequest payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    if (payload.getId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("PUT without payload identifier").build();
    }

    // Entities and identifiers
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceUser workspaceUser = workspaceController.findWorkspaceUser(workspaceUserEntity);
    if (workspaceUser == null) {
      logger.warning(String.format("Workspace user for workspaceUserEntityId %d not found", workspaceUserEntityId));
      return Response.status(Status.NOT_FOUND).build();
    }
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    if (workspaceEntity == null || userSchoolDataIdentifier == null || workspace == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    SchoolDataIdentifier assessmentRequestIdentifier = SchoolDataIdentifier.fromId(assessmentRequestId);

    WorkspaceAssessmentRequest assessmentRequest = assessmentRequestController.findWorkspaceAssessmentRequest(assessmentRequestIdentifier, workspaceEntity.schoolDataIdentifier(), workspaceUser.getUserIdentifier());
    
    if (assessmentRequest == null) {
      logger.warning(String.format("Workspace assessment request for workspaceUserEntityId %d not found", workspaceUserEntityId));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorkspaceAssessmentRequest request = gradingController.updateWorkspaceAssessmentLock(assessmentRequest.getSchoolDataSource(), assessmentRequest.getIdentifier(), assessmentRequest.getWorkspaceUserIdentifier(), assessmentRequest.getWorkspaceUserSchoolDataSource(), workspaceEntity.getIdentifier(), workspaceUserEntity.getIdentifier(), payload.getLocked());
    
    RestAssessmentRequest restAssessment = new RestAssessmentRequest();
    
    restAssessment.setAssessmentRequestDate(request.getDate());
    
    AssessmentRequestRESTModel restModel = assessmentRequestController.restModel(request);

    return Response.ok(restModel).build();
  }
  
  @PUT
  @Path("/workspaceuser/{WORKSPACEUSERENTITYID}/evaluationrequestarchive")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response archiveWorkspaceAssessmentRequest(@PathParam("WORKSPACEUSERENTITYID") Long workspaceUserEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // #6006: Restore endpoint functionality to pre-state of botched fix #5940
    
    // Entities and identifiers
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityById(workspaceUserEntityId);
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    // List all assessment requests by student X to course Y
    
    List<WorkspaceAssessmentRequest> requests = gradingController.listWorkspaceAssessmentRequests(
        workspaceEntity.getDataSource().getIdentifier(),
        workspaceEntity.getIdentifier(),
        workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(),
        false);

    // Mark each assessment request archived
    // #5940 hard deleted only latest, and even failed to figure out the correct one
    
    if (CollectionUtils.isNotEmpty(requests)) {
      for (WorkspaceAssessmentRequest request : requests) {
        gradingController.updateWorkspaceAssessmentRequest(
          request.getSchoolDataSource(),
          request.getIdentifier(),
          request.getWorkspaceUserIdentifier(),
          request.getWorkspaceUserSchoolDataSource(),
          workspaceEntity.getIdentifier(),
          workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier(),
          request.getRequestText(),
          request.getDate(),
          Boolean.TRUE, // archived
          request.getHandled());
      }
      
      UserEntity studentEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(workspaceUserEntity.getUserSchoolDataIdentifier().getDataSource(), workspaceUserEntity.getUserSchoolDataIdentifier().getIdentifier());
      List<AssessmentRequestCancellation> assessmentRequestCancellations = evaluationController.listAssessmentRequestCancellationsByStudentAndWorkspace(studentEntity.getId(), workspaceEntity.getId());
      
      for (AssessmentRequestCancellation cancellation : assessmentRequestCancellations) {
        evaluationController.deleteAssessmentRequestCancellation(cancellation);
      }
      return Response.noContent().build();
    }
    return Response.status(Status.BAD_REQUEST).build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTENTITYID}/journalfeedback")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateWorkspaceJournalFeedback(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTENTITYID") Long studentEntityId, RestWorkspaceJournalFeedback payload) {
    
    // Access check
    
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // Entities & null checks
    UserEntity studentEntity = userEntityController.findUserEntityById(studentEntityId);
    
    if (studentEntity == null) {
      return Response.status(Status.BAD_REQUEST)
        .entity(String.format("Malformed student entity %d", studentEntity))
        .build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);

    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace entity %d", workspaceEntityId))
        .build();
    }
    
    // Create or update
    WorkspaceJournalFeedback journalFeedback = evaluationController.findWorkspaceJournalFeedbackByStudentAndWorkspace(studentEntity.getId(), workspaceEntity.getId());
    
    if (journalFeedback != null) {
      journalFeedback = evaluationController.updateWorkspaceJournalFeedback(journalFeedback, payload.getFeedback());
    } else {
      journalFeedback = evaluationController.createWorkspaceJournalFeedback(
        studentEntity.getId(), 
        workspaceEntity.getId(), 
        sessionController.getLoggedUserEntity().getId(), 
        payload.getFeedback());
    }
    return Response.ok(createRestModel(journalFeedback)).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTENTITYID}/journalfeedback")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceStudentJournalFeedback(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTENTITYID") Long studentEntityId) {
    // Entities
    UserEntity studentEntity = userEntityController.findUserEntityById(studentEntityId);
    
    if (studentEntity == null) {
      return Response.status(Status.BAD_REQUEST)
        .entity(String.format("Malformed student entity %s", studentEntity))
        .build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace entity %d", workspaceEntityId))
        .build();
    }
    // Access
    if (!sessionController.getLoggedUserEntity().getId().equals(studentEntity.getId())) {
      if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    WorkspaceJournalFeedback journalFeedback = evaluationController.findWorkspaceJournalFeedbackByStudentAndWorkspace(studentEntity.getId(), workspaceEntity.getId());
    
    if (journalFeedback == null) {
      return Response.noContent().build();
    }
    return Response.ok(createRestModel(journalFeedback)).build();
  }
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTENTITYID}/journalfeedback/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceJournalFeedback(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTENTITYID") Long studentEntityId, @PathParam("ID") Long feedbackId) {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceJournalFeedback journalFeedback = evaluationController.findWorkspaceJournalFeedbackByStudentAndWorkspace(studentEntityId, workspaceEntityId);
    
    if (journalFeedback == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    evaluationController.deleteWorkspaceJournalFeedback(journalFeedback);

    return Response.noContent().build();
  
  }
  
  private RestWorkspaceJournalFeedback createRestModel(WorkspaceJournalFeedback journalFeedback) {
    RestWorkspaceJournalFeedback restFeedback = new RestWorkspaceJournalFeedback();
    UserEntity creatorEntity = userEntityController.findUserEntityById(journalFeedback.getCreator());

    String creatorName = null;
    if (creatorEntity != null) {
      UserEntityName userEntityName = userEntityController.getName(creatorEntity, false);
      creatorName = userEntityName != null ? userEntityName.getDisplayName() : null; 
    }
    restFeedback.setId(journalFeedback.getId());
    restFeedback.setCreated(journalFeedback.getCreated());
    restFeedback.setCreator(journalFeedback.getCreator());
    restFeedback.setCreatorName(creatorName);
    restFeedback.setFeedback(journalFeedback.getFeedback());
    restFeedback.setStudent(journalFeedback.getStudent());
    restFeedback.setWorkspaceEntityId(journalFeedback.getWorkspaceEntityId());
    
    return restFeedback;
  }
  
  private RestSupplementationRequest createRestModel(SupplementationRequest supplementationRequest) {
    // SupplementationRequest to RestSupplementationRequest

    RestSupplementationRequest restSupplementationRequest = new RestSupplementationRequest(
        supplementationRequest.getId(),
        supplementationRequest.getUserEntityId(),
        supplementationRequest.getStudentEntityId(),
        supplementationRequest.getWorkspaceEntityId(),
        supplementationRequest.getWorkspaceSubjectIdentifier(),
        supplementationRequest.getRequestDate(),
        supplementationRequest.getRequestText());

    return restSupplementationRequest;
  }
  
  private List<RestWorkspaceMaterialEvaluation> createRestModel(fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation... entries) {
    List<RestWorkspaceMaterialEvaluation> result = new ArrayList<>();

    for (fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  
  private RestWorkspaceMaterialEvaluation createRestModel(fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation evaluation) {
    Boolean passingGrade = null;
    String grade = null;
    String gradingScaleStr = null;
    if (evaluation.getGradingScaleSchoolDataSource() != null &&
        evaluation.getGradingScaleIdentifier() != null &&
        evaluation.getGradeSchoolDataSource() != null &&
        evaluation.getGradeIdentifier() != null) {
      GradingScale gradingScale = gradingController.findGradingScale(
          evaluation.getGradingScaleSchoolDataSource(),
          evaluation.getGradingScaleIdentifier());
      if (gradingScale == null) {
        logger.severe(String.format("Grading scale %s-%s not found for evaluation %d",
            evaluation.getGradingScaleSchoolDataSource(),
            evaluation.getGradingScaleIdentifier(),
            evaluation.getId()));
      }
      else {
        GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(
            gradingScale,
            evaluation.getGradeSchoolDataSource(),
            evaluation.getGradeIdentifier());
        if (gradingScaleItem == null) {
          logger.severe(String.format("Grading scale item %s-%s not found for evaluation %d",
              evaluation.getGradeSchoolDataSource(),
              evaluation.getGradeIdentifier(),
              evaluation.getId()));
        }
        else {
          grade = gradingScaleItem.getName();
          gradingScaleStr = gradingScale.getName();
          passingGrade = gradingScaleItem.isPassingGrade();
        }
      }
    }

    // Audio Assessments
    
    List<WorkspaceMaterialEvaluationAudioClip> evaluationAudioClips = evaluationController.listEvaluationAudioClips(evaluation);
    List<RestAssignmentEvaluationAudioClip> audioAssessments = evaluationAudioClips.stream()
        .map(audioClip -> new RestAssignmentEvaluationAudioClip(audioClip.getClipId(), audioClip.getFileName(), audioClip.getContentType()))
        .collect(Collectors.toList());
    
    return new RestWorkspaceMaterialEvaluation(
        evaluation.getId(), 
        evaluation.getEvaluated(), 
        evaluation.getAssessorEntityId(), 
        evaluation.getStudentEntityId(), 
        evaluation.getWorkspaceMaterialId(), 
        evaluation.getGradingScaleIdentifier(), 
        evaluation.getGradingScaleSchoolDataSource(), 
        grade,
        evaluation.getGradeIdentifier(), 
        evaluation.getGradeSchoolDataSource(),
        gradingScaleStr,
        evaluation.getVerbalAssessment(),
        passingGrade,
        audioAssessments);
  }
  
  private RestAssessmentRequest toRestAssessmentRequest(CompositeAssessmentRequest compositeAssessmentRequest, Map<Long, Workspace> workspaceCache) {
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
      assignmentsTotal = Long.valueOf(evaluatedAssignments.size()); 
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

    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    boolean resolvedState = false;
    
    // An active workspace supplementation request will override graded, passing, and evaluationDate
    
    Boolean passing = compositeAssessmentRequest.getPassing();
    Date evaluationDate = compositeAssessmentRequest.getEvaluationDate();
    Boolean graded = evaluationDate != null;
    if (userEntity != null) {
      SupplementationRequest supplementationRequest = evaluationController.findLatestSupplementationRequestByStudentAndWorkspaceAndHandledAndArchived(
          userEntity.getId(),
          workspaceEntity.getId(),
          Boolean.FALSE,
          Boolean.FALSE);
      if (supplementationRequest != null && (evaluationDate == null || evaluationDate.before(supplementationRequest.getRequestDate()))) {
        graded = Boolean.FALSE;
        passing = Boolean.FALSE;
        evaluationDate = supplementationRequest.getRequestDate();
        restAssessmentRequest.setState(WorkspaceAssessmentState.INCOMPLETE);
        resolvedState = true;
      }
    }
    
    Date requestDate = compositeAssessmentRequest.getAssessmentRequestDate();
    restAssessmentRequest.setIdentifier(compositeAssessmentRequest.getIdentifier().toId());
    restAssessmentRequest.setWorkspaceUserEntityId(workspaceUserEntity == null ? null : workspaceUserEntity.getId());
    restAssessmentRequest.setWorkspaceUserIdentifier(compositeAssessmentRequest.getCourseStudentIdentifier().toId());
    restAssessmentRequest.setUserEntityId(userEntity == null ? null : userEntity.getId());
    restAssessmentRequest.setAssessmentRequestDate(requestDate);
    restAssessmentRequest.setEvaluationDate(evaluationDate);
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
    if (!resolvedState) {
      if (graded && (requestDate == null || evaluationDate.after(requestDate))) {
        if (passing) {
          restAssessmentRequest.setState(WorkspaceAssessmentState.PASS);
        }
        else {
          restAssessmentRequest.setState(WorkspaceAssessmentState.FAIL);
        }
      }
      else if (requestDate != null) {
        if (evaluationDate == null) {
          restAssessmentRequest.setState(WorkspaceAssessmentState.PENDING);
        }
        else if (passing) {
          restAssessmentRequest.setState(WorkspaceAssessmentState.PENDING_PASS);
        }
        else {
          restAssessmentRequest.setState(WorkspaceAssessmentState.PENDING_FAIL);
        }
      }
      else {
        restAssessmentRequest.setState(WorkspaceAssessmentState.UNASSESSED);
      }
    }
    
    Workspace workspace = workspaceCache.get(workspaceEntity.getId());
    if (workspace == null) {
      workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceCache.put(workspaceEntity.getId(), workspace);
    }
    List<WorkspaceSubjectRestModel> subjects = workspace.getSubjects().stream()
        .map(workspaceSubject -> workspaceRestModels.toRestModel(workspaceSubject))
        .collect(Collectors.toList());
    restAssessmentRequest.setSubjects(subjects);
    Boolean hasPedagogyForm = pedagogyController.getHasPedagogyForm(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().defaultSchoolDataIdentifier().toId());
    restAssessmentRequest.setHasPedagogyForm(hasPedagogyForm);
    return restAssessmentRequest;
  }

  private RestAssessmentRequest toRestAssessmentRequest(InterimEvaluationRequest interimEvaluationRequest, Map<Long, Workspace> workspaceCache) {
    Long assignmentsDone = 0L;
    Long assignmentsTotal = 0L;
    // Assignments total
    UserEntity userEntity = userEntityController.findUserEntityById(interimEvaluationRequest.getUserEntityId());            
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(interimEvaluationRequest.getWorkspaceEntityId());
    WorkspaceEntityName workspaceEntityName = workspaceEntityController.getName(workspaceEntity);
    UserEntityName userEntityName = userEntityController.getName(userEntity.defaultSchoolDataIdentifier(), true);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
        workspaceEntity, userEntity.defaultSchoolDataIdentifier());
    
    // Bug fix for non-course students having been able to request interim evaluation...
    
    if (workspaceUserEntity == null) {
      return null;
    }
    
    WorkspaceUser workspaceUser = workspaceUserEntity == null
        ? null
        : workspaceController.findWorkspaceUser(workspaceUserEntity); // unavoidable Pyramus call just for enrollment date :'(
    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
        workspaceEntity,
        WorkspaceMaterialAssignmentType.EVALUATED);
    assignmentsTotal = Long.valueOf(evaluatedAssignments.size());
    // Assignments done by user
    if (assignmentsTotal > 0) {
      List<WorkspaceMaterialReplyState> replyStates = new ArrayList<WorkspaceMaterialReplyState>();
      replyStates.add(WorkspaceMaterialReplyState.FAILED);
      replyStates.add(WorkspaceMaterialReplyState.PASSED);
      replyStates.add(WorkspaceMaterialReplyState.SUBMITTED);
      replyStates.add(WorkspaceMaterialReplyState.INCOMPLETE);
      assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(
          userEntity.getId(), replyStates, evaluatedAssignments);
    }

    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    restAssessmentRequest.setId(interimEvaluationRequest.getId());
    restAssessmentRequest.setWorkspaceUserEntityId(workspaceUserEntity.getId());
    restAssessmentRequest.setWorkspaceUserIdentifier(workspaceUserEntity.getIdentifier());
    restAssessmentRequest.setUserEntityId(userEntity == null ? null : userEntity.getId());
    restAssessmentRequest.setAssessmentRequestDate(interimEvaluationRequest.getRequestDate());
    restAssessmentRequest.setEvaluationDate(null);
    restAssessmentRequest.setAssignmentsDone(assignmentsDone);
    restAssessmentRequest.setAssignmentsTotal(assignmentsTotal);
    if (workspaceUser != null && workspaceUser.getEnrolmentTime() != null) {
      restAssessmentRequest.setEnrollmentDate(Date.from(workspaceUser.getEnrolmentTime().toInstant()));
    }
    String firstName = userEntityName.getFirstName();
    if (!StringUtils.isEmpty(userEntityName.getNickName())) {
      firstName = String.format("%s \"%s\"", firstName, userEntityName.getNickName());
    }
    restAssessmentRequest.setFirstName(firstName);
    restAssessmentRequest.setLastName(userEntityName.getLastName());
    restAssessmentRequest.setStudyProgramme(userEntityName.getStudyProgrammeName());
    restAssessmentRequest.setWorkspaceEntityId(workspaceEntity == null ? null : workspaceEntity.getId());
    restAssessmentRequest.setWorkspaceName(workspaceEntityName.getName());
    restAssessmentRequest.setWorkspaceNameExtension(workspaceEntityName.getNameExtension());
    restAssessmentRequest.setWorkspaceUrlName(workspaceEntity == null ? null : workspaceEntity.getUrlName());
    restAssessmentRequest.setState(WorkspaceAssessmentState.INTERIM_EVALUATION_REQUEST);

    Workspace workspace = workspaceCache.get(workspaceEntity.getId());
    if (workspace == null) {
      workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceCache.put(workspaceEntity.getId(), workspace);
    }
    List<WorkspaceSubjectRestModel> subjects = workspace.getSubjects().stream()
        .map(workspaceSubject -> workspaceRestModels.toRestModel(workspaceSubject))
        .collect(Collectors.toList());
    restAssessmentRequest.setSubjects(subjects);
    Boolean hasPedagogyForm = pedagogyController.getHasPedagogyForm(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().defaultSchoolDataIdentifier().toId());
    restAssessmentRequest.setHasPedagogyForm(hasPedagogyForm);
    
    return restAssessmentRequest;
  }
  
  private RestAssessmentRequest toRestAssessmentRequest(SupplementationRequest supplementationRequest, Map<Long, Workspace> workspaceCache) {
    Long assignmentsDone = 0L;
    Long assignmentsTotal = 0L;
    // Assignments total
    UserEntity userEntity = userEntityController.findUserEntityById(supplementationRequest.getStudentEntityId());            
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(supplementationRequest.getWorkspaceEntityId());
    WorkspaceEntityName workspaceEntityName = workspaceEntityController.getName(workspaceEntity);
    UserEntityName userEntityName = userEntityController.getName(userEntity.defaultSchoolDataIdentifier(), true);
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(
        workspaceEntity, userEntity.defaultSchoolDataIdentifier());
    
    // Bug fix for non-course students having been given a supplementation request...
    
    if (workspaceUserEntity == null) {
      return null;
    }
    
    WorkspaceUser workspaceUser = workspaceUserEntity == null
        ? null
        : workspaceController.findWorkspaceUser(workspaceUserEntity); // unavoidable Pyramus call just for enrollment date :'(
    List<WorkspaceMaterial> evaluatedAssignments = workspaceMaterialController.listVisibleWorkspaceMaterialsByAssignmentType(
        workspaceEntity,
        WorkspaceMaterialAssignmentType.EVALUATED);
    assignmentsTotal = Long.valueOf(evaluatedAssignments.size());
    // Assignments done by user
    if (assignmentsTotal > 0) {
      List<WorkspaceMaterialReplyState> replyStates = new ArrayList<WorkspaceMaterialReplyState>();
      replyStates.add(WorkspaceMaterialReplyState.FAILED);
      replyStates.add(WorkspaceMaterialReplyState.PASSED);
      replyStates.add(WorkspaceMaterialReplyState.SUBMITTED);
      replyStates.add(WorkspaceMaterialReplyState.INCOMPLETE);
      assignmentsDone = workspaceMaterialReplyController.getReplyCountByUserEntityAndReplyStatesAndWorkspaceMaterials(
          userEntity.getId(), replyStates, evaluatedAssignments);
    }

    RestAssessmentRequest restAssessmentRequest = new RestAssessmentRequest();
    restAssessmentRequest.setId(supplementationRequest.getId());
    restAssessmentRequest.setWorkspaceUserEntityId(workspaceUserEntity.getId());
    restAssessmentRequest.setWorkspaceUserIdentifier(workspaceUserEntity.getIdentifier());
    restAssessmentRequest.setUserEntityId(userEntity == null ? null : userEntity.getId());
    restAssessmentRequest.setEvaluationDate(supplementationRequest.getRequestDate());
    restAssessmentRequest.setAssignmentsDone(assignmentsDone);
    restAssessmentRequest.setAssignmentsTotal(assignmentsTotal);
    if (workspaceUser != null && workspaceUser.getEnrolmentTime() != null) {
      restAssessmentRequest.setEnrollmentDate(Date.from(workspaceUser.getEnrolmentTime().toInstant()));
    }
    String firstName = userEntityName.getFirstName();
    if (!StringUtils.isEmpty(userEntityName.getNickName())) {
      firstName = String.format("%s \"%s\"", firstName, userEntityName.getNickName());
    }
    restAssessmentRequest.setFirstName(firstName);
    restAssessmentRequest.setLastName(userEntityName.getLastName());
    restAssessmentRequest.setStudyProgramme(userEntityName.getStudyProgrammeName());
    restAssessmentRequest.setWorkspaceEntityId(workspaceEntity == null ? null : workspaceEntity.getId());
    restAssessmentRequest.setWorkspaceName(workspaceEntityName.getName());
    restAssessmentRequest.setWorkspaceNameExtension(workspaceEntityName.getNameExtension());
    restAssessmentRequest.setWorkspaceUrlName(workspaceEntity == null ? null : workspaceEntity.getUrlName());
    restAssessmentRequest.setState(WorkspaceAssessmentState.INCOMPLETE);

    Workspace workspace = workspaceCache.get(workspaceEntity.getId());
    if (workspace == null) {
      workspace = workspaceController.findWorkspace(workspaceEntity);
      workspaceCache.put(workspaceEntity.getId(), workspace);
    }
    List<WorkspaceSubjectRestModel> subjects = workspace.getSubjects().stream()
        .map(workspaceSubject -> workspaceRestModels.toRestModel(workspaceSubject))
        .collect(Collectors.toList());
    restAssessmentRequest.setSubjects(subjects);
    Boolean hasPedagogyForm = pedagogyController.getHasPedagogyForm(workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity().defaultSchoolDataIdentifier().toId());
    restAssessmentRequest.setHasPedagogyForm(hasPedagogyForm);
    
    return restAssessmentRequest;
  }

  private RestInterimEvaluationRequest toRestModel(InterimEvaluationRequest interimEvaluationRequest) {
    return new RestInterimEvaluationRequest(
        interimEvaluationRequest.getId(),
        interimEvaluationRequest.getUserEntityId(),
        interimEvaluationRequest.getWorkspaceMaterialId(),
        interimEvaluationRequest.getRequestDate(),
        interimEvaluationRequest.getCancellationDate(),
        interimEvaluationRequest.getRequestText(),
        interimEvaluationRequest.getArchived());
  }
}
