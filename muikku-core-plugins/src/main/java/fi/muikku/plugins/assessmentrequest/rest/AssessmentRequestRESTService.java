package fi.muikku.plugins.assessmentrequest.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequest;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestState;
import fi.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.EnvironmentUserController;

@RequestScoped
@Path("/assessmentrequest")
@Produces("application/json")
@Stateful
public class AssessmentRequestRESTService extends PluginRESTService {

  private static final long serialVersionUID = 1L;

  @Inject
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private WorkspaceController workspaceController;

  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private EnvironmentUserController environmentUserController;

  @POST
  @Path("/assessmentrequests")
  public Response requestAssessment(AssessmentRequestRESTModel assessmentRequest) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(assessmentRequest.getWorkspaceId());
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    UserEntity student = sessionController.getLoggedUserEntity();
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    assessmentRequest.setState("PENDING");
    assessmentRequestController.requestAssessment(workspaceEntity, student, assessmentRequest.getMessage());
    return Response.ok((Object) assessmentRequest).build();
  }

  @GET
  @Path("/assessmentrequests")
  public Response listAssessmentRequestsByWorkspaceId(
      @QueryParam("workspaceId") long workspaceEntityId,
      @QueryParam("allUsers") @DefaultValue("false") boolean allUsers) {
    List<AssessmentRequest> assessmentRequests = new ArrayList<>();
    
    if (allUsers) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
      assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity);
    } else {
      UserEntity student = sessionController.getLoggedUserEntity();
      assessmentRequests = assessmentRequestController.listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntityId, student.getId());
    }

    List<AssessmentRequestRESTModel> restAssessmentRequests = new ArrayList<>();
    for (AssessmentRequest assessmentRequest : assessmentRequests) {
      AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel();

      restAssessmentRequest.setId(assessmentRequest.getId());
      restAssessmentRequest.setWorkspaceId(assessmentRequest.getWorkspace());
      restAssessmentRequest.setMessage(assessmentRequest.getMessage());
      restAssessmentRequest.setState(assessmentRequest.getState().toString());

      restAssessmentRequests.add(restAssessmentRequest);
    }

    return Response.ok(restAssessmentRequests).build();
  }
  
  @GET
  @Path("/assessmentrequestsforme")
  public Response listAssessmentRequestsForMe(
      @QueryParam("workspaceId") Long workspaceEntityId,
      @QueryParam("userId") Long userEntityId,
      @QueryParam("state") String state
  ) {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    List<EnvironmentRoleArchetype> permittedArchetypes = Arrays.asList(
        EnvironmentRoleArchetype.ADMINISTRATOR,
        EnvironmentRoleArchetype.MANAGER,
        EnvironmentRoleArchetype.TEACHER);
    
    EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
    if (environmentUser.getRole() == null || !permittedArchetypes.contains(environmentUser.getRole().getArchetype())) {
      return Response.status(Status.FORBIDDEN).entity("Must be a teacher").build();
    }
    
    List<AssessmentRequest> assessmentRequests = new ArrayList<AssessmentRequest>(assessmentRequestController.listByUser(userEntity));
    ListIterator<AssessmentRequest> iterator = assessmentRequests.listIterator();
    
    while (iterator.hasNext()) {
      AssessmentRequest assessmentRequest = iterator.next();
      
      if ((workspaceEntityId != null && !workspaceEntityId.equals(assessmentRequest.getWorkspace()))
          || (userEntityId != null && !userEntityId.equals(assessmentRequest.getStudent()))
          || (state != null && !state.equals(assessmentRequest.getState().name()))) {
        iterator.remove();
        continue;
      }
    }

    List<AssessmentRequestRESTModel> restAssessmentRequests = new ArrayList<>();
    for (AssessmentRequest assessmentRequest : assessmentRequests) {
      AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel();

      restAssessmentRequest.setId(assessmentRequest.getId());
      restAssessmentRequest.setWorkspaceId(assessmentRequest.getWorkspace());
      restAssessmentRequest.setMessage(assessmentRequest.getMessage());
      restAssessmentRequest.setState(assessmentRequest.getState().toString());

      restAssessmentRequests.add(restAssessmentRequest);
    }

    return Response.ok(restAssessmentRequests).build();
    
  }

  @POST
  @Path("/cancellastassessmentrequest/{WORKSPACEID}")
  public Response cancelLastAssessmentRequest(@PathParam("WORKSPACEID") long workspaceEntityId) {
    UserEntity student = sessionController.getLoggedUserEntity();
    List<AssessmentRequest> assessmentRequests = assessmentRequestController
        .listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntityId, student.getId());

    if (assessmentRequests.isEmpty()) {
      return Response.status(Status.NOT_FOUND).build();
    }

    AssessmentRequest assessmentRequest = assessmentRequests.get(0);

    if (student == null || student.getId() != assessmentRequest.getStudent()) {
      return Response.status(Status.FORBIDDEN).build();
    }

    assessmentRequestController.cancelAssessmentRequest(assessmentRequest);
    AssessmentRequestRESTModel restAssessmentRequest = new AssessmentRequestRESTModel();
    restAssessmentRequest.setId(assessmentRequest.getId());
    restAssessmentRequest.setWorkspaceId(assessmentRequest.getWorkspace());
    restAssessmentRequest.setMessage(assessmentRequest.getMessage());
    restAssessmentRequest.setState(assessmentRequest.getState().toString());
    return Response.ok(restAssessmentRequest).build();
  }
}
