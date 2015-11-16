package fi.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.evaluation.rest.model.WorkspaceAssessor;
import fi.muikku.plugins.evaluation.rest.model.WorkspaceMaterialEvaluation;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.muikku.plugins.workspace.rest.model.WorkspaceUser;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.GradingController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.GradingScale;
import fi.muikku.schooldata.entity.GradingScaleItem;
import fi.muikku.schooldata.entity.User;
import fi.muikku.security.MuikkuPermissions;
import fi.muikku.session.SessionController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/workspace")
public class EvaluationRESTService extends PluginRESTService {

  private static final long serialVersionUID = -2380108419567067263L;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private GradingController gradingController;
  
  @Inject
  private EvaluationController evaluationController;
  
  @POST
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/")
  @RESTPermitUnimplemented
  public Response createWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, WorkspaceMaterialEvaluation payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.EVALUATE_MATERIAL, workspaceEntity)) {
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
    
    Date evaluated = payload.getEvaluated();
    
    return Response.ok(createRestModel(
      evaluationController.createWorkspaceMaterialEvaluation(student, workspaceMaterial, gradingScale, grade, assessor, evaluated, payload.getVerbalAssessment())
    )).build();
  }

  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/assessors")
  @RESTPermitUnimplemented
  public Response listWorkspaceAssessors(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    
    List<UserEntity> workspaceUsers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.TEACHER);
    
    List<WorkspaceAssessor> result = new ArrayList<>();
    
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    
    for (UserEntity userEntity : workspaceUsers) {
      User user = userController.findUserByUserEntityDefaults(userEntity);
      result.add(
          new WorkspaceAssessor(
              user.getDisplayName(),
              userEntity.getId(),
              userEntity.getId().equals(loggedUserEntity.getId())));
    }
    
    return Response.ok(result).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/")
  @RESTPermitUnimplemented
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
      if (!sessionController.hasCoursePermission(MuikkuPermissions.VIEW_MATERIAL_EVALUATION, workspaceEntity)) {
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
    
    List<fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation> result = new ArrayList<>();
    
    fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluationByWorkspaceMaterialAndStudent(workspaceMaterial, userEntity);
    if (workspaceMaterialEvaluation != null) {
      result.add(workspaceMaterialEvaluation);
    }
    
    if (result.isEmpty()) {
      return Response.noContent().build();
    }
    
    if (!workspaceMaterialEvaluation.getWorkspaceMaterialId().equals(workspaceMaterial.getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    return Response.ok(createRestModel(result.toArray(new fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation[0]))).build();
  }
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/{ID}")
  @RESTPermitUnimplemented
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
    
    fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluation(workspaceMaterialEvaluationId);
    if (workspaceMaterialEvaluation == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!workspaceMaterialEvaluation.getWorkspaceMaterialId().equals(workspaceMaterial.getId())) {
      return Response.status(Status.NOT_FOUND).build();
    }

    if (!sessionController.getLoggedUserEntity().getId().equals(workspaceMaterialEvaluation.getStudentEntityId())) {
      if (!sessionController.hasCoursePermission(MuikkuPermissions.VIEW_MATERIAL_EVALUATION, workspaceEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    return Response.ok(createRestModel(workspaceMaterialEvaluation)).build();
  }
  
  @PUT
  @Path("/workspaces/{WORKSPACEENTITYID}/materials/{WORKSPACEMATERIALID}/evaluations/{ID}")
  @RESTPermitUnimplemented
  public Response updateWorkspaceMaterialEvaluation(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("WORKSPACEMATERIALID") Long workspaceMaterialId, @PathParam("ID") Long workspaceMaterialEvaluationId, WorkspaceMaterialEvaluation payload) {
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (!sessionController.hasCoursePermission(MuikkuPermissions.EVALUATE_MATERIAL, workspaceEntity)) {
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
    
    fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation workspaceMaterialEvaluation = evaluationController.findWorkspaceMaterialEvaluation(workspaceMaterialEvaluationId);
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

  
  private List<WorkspaceMaterialEvaluation> createRestModel(fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation... entries) {
    List<WorkspaceMaterialEvaluation> result = new ArrayList<>();

    for (fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation entry : entries) {
      result.add(createRestModel(entry));
    }

    return result;
  }
  
  private WorkspaceMaterialEvaluation createRestModel(fi.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluation evaluation) {
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
        evaluation.getVerbalAssessment());
  }
  
}
