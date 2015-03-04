package fi.muikku.plugins.assessmentrequest.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.rest.model.AssessmentRequestRESTModel;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.users.UserEntityController;

@Path("/assessmentrequest")
@Produces("application/json")
@Stateless
public class AssessmentRequestRESTService extends PluginRESTService {
  
  private static final long serialVersionUID = 1L;

  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @POST
  @Path("/assessmentrequests")
  public Response requestAssessments(AssessmentRequestRESTModel assessmentRequest) {
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(assessmentRequest.getWorkspaceId());
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    UserEntity student = userEntityController.findUserEntityById(assessmentRequest.getStudentId());
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    assessmentRequestController.requestAssessment(workspaceEntity, student, assessmentRequest.getMessage());
    return Response.ok((Object)assessmentRequest).build();
  }
}
