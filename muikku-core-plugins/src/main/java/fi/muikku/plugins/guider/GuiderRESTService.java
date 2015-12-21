package fi.muikku.plugins.guider;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/guider")
public class GuiderRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private GuiderController guiderController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/studentactivity/{USERIDENTIFIER}")
  @RESTPermit (GuiderPermissions.GUIDER_FIND_STUDENT_WORKSPACE_ACTIVITY)
  public Response getWorkspaceAssessmentsStudyProgressAnalysis(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @PathParam("USERIDENTIFIER") String userId) {
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceAndUserIdentifier(workspaceEntity, userIdentifier);
    if (workspaceUserEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceUserEntity not found").build();
    }
    
    GuiderStudentWorkspaceActivity activity = guiderController.getStudentWorkspaceActivity(workspaceEntity, userIdentifier);
    if (activity == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to analyze assignments progress for student %s in workspace %d", userIdentifier, workspaceEntity.getId())).build();
    }
    
    WorkspaceAssessmentState assessmentState = assessmentRequestController.getWorkspaceAssessmentState(workspaceUserEntity);
    
    GuiderStudentWorkspaceActivityRestModel model = new GuiderStudentWorkspaceActivityRestModel(
        activity.getLastVisit(),
        activity.getNumVisits(),
        activity.getJournalEntryCount(),
        activity.getLastJournalEntry(),
        activity.getEvaluables().getUnanswered(), 
        activity.getEvaluables().getAnswered(), 
        activity.getEvaluables().getAnsweredLastDate(), 
        activity.getEvaluables().getSubmitted(), 
        activity.getEvaluables().getSubmittedLastDate(), 
        activity.getEvaluables().getPassed(), 
        activity.getEvaluables().getPassedLastDate(), 
        activity.getEvaluables().getFailed(), 
        activity.getEvaluables().getFailedLastDate(), 
        activity.getEvaluables().getDonePercent(), 
        activity.getExcercices().getUnanswered(), 
        activity.getExcercices().getAnswered(), 
        activity.getExcercices().getAnsweredLastDate(), 
        activity.getExcercices().getDonePercent(),
        assessmentState);
    
    return Response.ok(model).build();
  }
  
}