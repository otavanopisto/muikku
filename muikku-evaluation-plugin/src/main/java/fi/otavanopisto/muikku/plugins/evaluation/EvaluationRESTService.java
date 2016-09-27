package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

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

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceAssessment;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGrade;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceGradingScale;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceMaterialEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.GradingController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.GradingScale;
import fi.otavanopisto.muikku.schooldata.entity.GradingScaleItem;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
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
@Path("/workspace")
@RestCatchSchoolDataExceptions
public class EvaluationRESTService extends PluginRESTService {

  private static final long serialVersionUID = -2380108419567067263L;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;

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
  private CommunicatorController communicatorController;
  
  @Inject
  private LocaleController localeController;
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTID}/assessments")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTID") String studentId, WorkspaceAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
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
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentIdentifier);
    if (workspaceStudentEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace student entity %s from workspace entity %d", studentIdentifier, workspaceEntityId))
        .build();
    }

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.EVALUATE_USER, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }

    User assessingUser = userController.findUserByUserEntityDefaults(assessor);
    if (assessingUser == null) {
      return Response.status(Status.BAD_REQUEST).entity("Could not find assessor from school data source").build(); 
    }
    
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    if (workspaceStudent == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR)
        .entity(String.format("Failed to get workspace student for workspace student entity %d from school data source", workspaceStudentEntity.getId()))
        .build(); 
    }
    
    Date evaluated = payload.getEvaluated();
    UserEntity student = userEntityController.findUserEntityByUserIdentifier(workspaceStudent.getUserIdentifier());
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment assessment = gradingController.createWorkspaceAssessment(
        workspaceStudent.getSchoolDataSource(),
        workspaceStudent,
        assessingUser,
        grade,
        payload.getVerbalAssessment(),
        evaluated);
    
    if (student != null && workspace != null && assessment != null) {
      sendAssessmentNotification(payload, assessor, student, workspace);
    }
    
    return Response.ok(createRestModel(workspaceEntity, assessment)).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTID}/assessments")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceStudentAssessments(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTID") String studentId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }

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
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    List<fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment> assessments = gradingController.listWorkspaceAssessments(workspaceIdentifier, studentIdentifier);
    
    return Response.ok(createRestModel(workspaceEntity, assessments.toArray(new fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment[0]))).build();
  }
    
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTID}/assessments/{EVALUATIONID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTID") String studentId, @PathParam("EVALUATIONID") String workspaceAssesmentId, WorkspaceAssessment payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
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
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());

    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentIdentifier);
    if (workspaceStudentEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace student entity %s from workspace entity %d", studentIdentifier, workspaceEntityId))
        .build();
    }
    
    SchoolDataIdentifier workspaceAssesmentIdentifier = SchoolDataIdentifier.fromId(workspaceAssesmentId);
    if (workspaceAssesmentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST)
        .entity(String.format("Malformed workspace assessment identifier %s", workspaceAssesmentIdentifier))
        .build();
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment workspaceAssessment = gradingController.findWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
    if (workspaceAssessment == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace assessment %s from workspace entity %d, student identifer %s", workspaceAssesmentId, workspaceEntityId, studentIdentifier))
        .build(); 
    }

    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.EVALUATE_USER, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    User assessingUser = userController.findUserByUserEntityDefaults(assessor);
    if (assessingUser == null) {
      return Response.status(Status.BAD_REQUEST).entity("Could not find assessor from school data source").build(); 
    }

    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }

    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    if (workspaceStudent == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR)
        .entity(String.format("Failed to get workspace student for workspace student entity %d from school data source", workspaceStudentEntity.getId()))
        .build(); 
    }
    
    Date evaluated = payload.getEvaluated();
    UserEntity student = userEntityController.findUserEntityByUserIdentifier(workspaceStudent.getUserIdentifier());
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment assessment =  gradingController.updateWorkspaceAssessment(
        workspaceAssesmentIdentifier,
        workspaceStudent,
        assessingUser,
        grade,
        payload.getVerbalAssessment(),
        evaluated);
    
    if (student != null && workspace != null && assessment != null) {
      sendAssessmentNotification(payload, assessor, student, workspace);
    }
    
    return Response.ok(createRestModel(workspaceEntity, assessment)).build();
  }
  
  @DELETE
  @Path("/workspaces/{WORKSPACEENTITYID}/students/{STUDENTID}/assessments/{EVALUATIONID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteWorkspaceAssessment(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("STUDENTID") String studentId, @PathParam("EVALUATIONID") String workspaceAssesmentId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
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
    
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier());
    
    WorkspaceUserEntity workspaceStudentEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, studentIdentifier);
    if (workspaceStudentEntity == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace student entity %s from workspace entity %d", studentIdentifier, workspaceEntityId))
        .build();
    }
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.EVALUATE_USER, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    SchoolDataIdentifier workspaceAssesmentIdentifier = SchoolDataIdentifier.fromId(workspaceAssesmentId);
    if (workspaceAssesmentIdentifier == null) {
      return Response.status(Status.BAD_REQUEST)
        .entity(String.format("Malformed workspace assessment identifier %s", workspaceAssesmentIdentifier))
        .build();
    }
    
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment workspaceAssessment = gradingController.findWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
    if (workspaceAssessment == null) {
      return Response.status(Status.NOT_FOUND)
        .entity(String.format("Could not find workspace assessment %s from workspace entity %d, student identifer %s", workspaceAssesmentId, workspaceEntityId, studentIdentifier))
        .build(); 
    }
        
    fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser workspaceStudent = workspaceController.findWorkspaceUser(workspaceStudentEntity);
    if (workspaceStudent == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR)
        .entity(String.format("Failed to get workspace student for workspace student entity %d from school data source", workspaceStudentEntity.getId()))
        .build(); 
    }
    
    gradingController.deleteWorkspaceAssessment(workspaceIdentifier, studentIdentifier, workspaceAssesmentIdentifier);
    
    return Response.noContent().build();
  }
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/")
  @RESTPermit(handling=Handling.INLINE)
  public Response createOrUpdateWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialEvaluation payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_CREATEWORKSPACEMATERIALEVALUATION, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getStudentEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("studentEntityId is missing").build(); 
    }
    
    if (payload.getGradingScaleSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradingScaleIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleIdentifier is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    UserEntity student = userEntityController.findUserEntityById(payload.getStudentEntityId());
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());

    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).entity("student is invalid").build(); 
    }
    
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }

    if (evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, student) != null) {
      return Response.status(Status.BAD_REQUEST).entity("material already evaluated").build(); 
    }
    
    Date evaluated = payload.getEvaluated();
    
    return Response.ok(createRestModel(
      evaluationController.createWorkspaceMaterialEvaluation(student, workspaceMaterial, gradingScale, grade, assessor, evaluated, payload.getVerbalAssessment())
    )).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/gradingScales")
  @RESTPermit(handling = Handling.INLINE)
  public Response listWorkspaceGrades(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_LISTGRADINGSCALES, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<WorkspaceGradingScale> result = new ArrayList<>();
    
    List<GradingScale> gradingScales = gradingController.listGradingScales();
    for (GradingScale gradingScale : gradingScales) {
      List<GradingScaleItem> gradingScaleItems = gradingController.listGradingScaleItems(gradingScale);
      List<WorkspaceGrade> workspaceGrades = new ArrayList<>();
      for (GradingScaleItem gradingScaleItem : gradingScaleItems) {
        workspaceGrades.add(
            new WorkspaceGrade(
                gradingScaleItem.getName(),
                gradingScaleItem.getIdentifier(),
                gradingScaleItem.getSchoolDataSource()));
      }
      result.add(
          new WorkspaceGradingScale(
              gradingScale.getName(),
              gradingScale.getIdentifier(),
              gradingScale.getSchoolDataSource(),
              workspaceGrades));
    }
    
    return Response.ok(result).build();
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
    
    fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
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
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response findWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam("ID") Long workspaceMaterialEvaluationId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluation(workspaceMaterialEvaluationId);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceMaterialEvaluation.getWorkspaceMaterialId().equals(workspaceMaterial.getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUserEntity().getId().equals(workspaceMaterialEvaluation.getStudentEntityId())) {
      if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_FINDWORKSPACEMATERIALEVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    return Response.ok(createRestModel(workspaceMaterialEvaluation)).build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/{ID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam("ID") Long workspaceMaterialEvaluationId, WorkspaceMaterialEvaluation payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_UPDATEWORKSPACEMATERIALEVALUATION, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    WorkspaceMaterial workspaceMaterial = workspaceMaterialController.findWorkspaceMaterialById(workspaceMaterialId);
    if (workspaceMaterial == null) {
      return Response.status(Status.NOT_FOUND).entity("workspaceMaterial not found").build();
    }

    WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceNode(workspaceMaterial);
    if (rootFolder == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    if (!workspaceEntity.getId().equals(rootFolder.getWorkspaceEntityId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluation(workspaceMaterialEvaluationId);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceMaterialEvaluation.getWorkspaceMaterialId().equals(workspaceMaterial.getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (payload.getEvaluated() == null) {
      return Response.status(Status.BAD_REQUEST).entity("evaluated is missing").build(); 
    }
    
    if (payload.getAssessorEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessorEntityId is missing").build(); 
    }
    
    if (payload.getGradingScaleSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradingScaleIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScaleIdentifier is missing").build(); 
    }
    
    if (payload.getGradeSchoolDataSource() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeSchoolDataSource is missing").build(); 
    }
    
    if (payload.getGradeIdentifier() == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradeIdentifier is missing").build(); 
    }

    UserEntity assessor = userEntityController.findUserEntityById(payload.getAssessorEntityId());
    UserEntity student = userEntityController.findUserEntityById(payload.getStudentEntityId());
    GradingScale gradingScale = gradingController.findGradingScale(payload.getGradingScaleSchoolDataSource(), payload.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, payload.getGradeSchoolDataSource(), payload.getGradeIdentifier());

    if (assessor == null) {
      return Response.status(Status.BAD_REQUEST).entity("assessor is invalid").build(); 
    }
    
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).entity("student is invalid").build(); 
    }
    
    if (gradingScale == null) {
      return Response.status(Status.BAD_REQUEST).entity("gradingScale is invalid").build(); 
    }
    
    if (grade == null) {
      return Response.status(Status.BAD_REQUEST).entity("grade is invalid").build(); 
    }
    
    Date evaluated = payload.getEvaluated();
    
    workspaceMaterialEvaluation = evaluationController.updateWorkspaceMaterialEvaluation(workspaceMaterialEvaluation, 
        gradingScale, 
        grade, 
        assessor, 
        evaluated,
        payload.getVerbalAssessment());
    
    return Response.ok(createRestModel(workspaceMaterialEvaluation)).build();
  }
  
  private List<WorkspaceMaterialEvaluation> createRestModel(fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation... entries) {
    List<WorkspaceMaterialEvaluation> result = new ArrayList<>();

    for (fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private WorkspaceMaterialEvaluation createRestModel(fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation evaluation) {
    Boolean passingGrade = null;
    String grade = null;
    if (evaluation.getGradingScaleSchoolDataSource() != null &&
        evaluation.getGradingScaleIdentifier() != null &&
        evaluation.getGradeSchoolDataSource() != null &&
        evaluation.getGradeIdentifier() != null) {
      GradingScale gradingScale = gradingController.findGradingScale(
          evaluation.getGradingScaleSchoolDataSource(),
          evaluation.getGradingScaleIdentifier());
      GradingScaleItem gradingScaleItem = gradingController.findGradingScaleItem(
          gradingScale,
          evaluation.getGradeSchoolDataSource(),
          evaluation.getGradeIdentifier());
      grade = gradingScaleItem.getName();
      passingGrade = gradingScaleItem.isPassingGrade();
    }

    return new WorkspaceMaterialEvaluation(
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
        evaluation.getVerbalAssessment(),
        passingGrade);
  }
  
  private fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceAssessment createRestModel(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment entry) {
    UserEntity assessor = userEntityController.findUserEntityByDataSourceAndIdentifier(entry.getAssessingUserSchoolDataSource(), entry.getAssessingUserIdentifier());
    GradingScale gradingScale = gradingController.findGradingScale(entry.getGradingScaleSchoolDataSource(), entry.getGradingScaleIdentifier());
    GradingScaleItem grade = gradingController.findGradingScaleItem(gradingScale, entry.getGradeSchoolDataSource(), entry.getGradeIdentifier());
    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(entry.getWorkspaceUserIdentifier(), entry.getWorkspaceUserSchoolDataSource());
    SchoolDataIdentifier assessmentIdentifier = new SchoolDataIdentifier(entry.getIdentifier(), entry.getSchoolDataSource());
    
    return new fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceAssessment(
      assessmentIdentifier.toId(),
      entry.getDate(),
      assessor != null ? assessor.getId() : null,
      workspaceUserIdentifier.toId(),
      entry.getGradingScaleIdentifier(),
      entry.getGradingScaleSchoolDataSource(),
      entry.getGradeIdentifier(),
      entry.getGradeSchoolDataSource(),
      entry.getVerbalAssessment(),
      grade.isPassingGrade()
    ); 
  }
  
  private List<fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceAssessment> createRestModel(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment... entries) {
    List<fi.otavanopisto.muikku.plugins.evaluation.rest.model.WorkspaceAssessment> result = new ArrayList<>();

    for (fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessment entry : entries) {
      result.add(createRestModel(workspaceEntity, entry));
    }

    return result;
  }

  private void sendAssessmentNotification(WorkspaceAssessment payload, UserEntity evaluator, UserEntity student, Workspace workspace) {
    Locale locale = userEntityController.getLocale(student);
    CommunicatorMessageCategory category = communicatorController.persistCategory("assessments");
    communicatorController.createMessage(
        communicatorController.createMessageId(),
        evaluator,
        Arrays.asList(student),
        category,
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationTitle",
            new Object[] {workspace.getName()}),
        localeController.getText(
            locale,
            "plugin.workspace.assessment.notificationContent",
            new Object[] {payload.getVerbalAssessment()}),
        Collections.<Tag>emptySet());
  }
}
