package fi.muikku.plugins.assessmentrequest.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequest;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

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
    return Response.ok((Object)assessmentRequest).build();
  }
  
  @GET
  @Path("/assessmentrequests")
  public Response listAssessmentRequestsOfCurrentUserByWorkspaceId(@QueryParam("workspaceId") long workspaceEntityId) {
    UserEntity student = sessionController.getLoggedUserEntity();
    List<AssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspaceIdAndStudentIdOrderByCreated(workspaceEntityId, student.getId());
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
}
