package fi.muikku.plugins.guidancetool;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.rest.RESTPermitUnimplemented;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.WorkspaceEntityController;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/studyactivityanalysis")
public class GuiderRESTService extends PluginRESTService {

  private static final long serialVersionUID = -5286350366083446537L;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private GuiderController guiderController;
  
  @GET
  @Path("/workspaces/{WORKSPACEENTITYID}/assessments")
  @RESTPermitUnimplemented
  public Response getWorkspaceAssessmentsStudyProgressAnalysis(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId, @QueryParam("userIdentifier") String userId) {
    SchoolDataIdentifier userIdentifier = SchoolDataIdentifier.fromId(userId);
    if (userIdentifier == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    if (workspaceEntity == null) {
      return Response.status(Status.NOT_FOUND).entity("WorkspaceEntity not found").build();
    }
    
    GuiderStudentWorkspaceActivity analysis = guiderController.getWorkspaceAssignmentsAnalysis(workspaceEntity, userIdentifier);
    if (analysis == null) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Failed to analyze assignments progress for student %s in workspace %d", userIdentifier, workspaceEntity.getId())).build();
    }
    
    GuiderStudentWorkspaceActivityRestModel model = new GuiderStudentWorkspaceActivityRestModel(
        analysis.getEvaluables().getUnanswered(), 
        analysis.getEvaluables().getAnswered(), 
        analysis.getEvaluables().getAnsweredLastDate(), 
        analysis.getEvaluables().getSubmitted(), 
        analysis.getEvaluables().getSubmittedLastDate(), 
        analysis.getEvaluables().getEvaluated(), 
        analysis.getEvaluables().getEvaluatedLastDate(), 
        analysis.getEvaluables().getDonePercent(), 
        analysis.getExcercices().getUnanswered(), 
        analysis.getExcercices().getAnswered(), 
        analysis.getExcercices().getAnsweredLastDate(), 
        analysis.getExcercices().getDonePercent());
    
    return Response.ok(model).build();
  }
  
}