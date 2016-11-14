package fi.otavanopisto.muikku.plugins.guider;

import java.util.List;
import java.util.Objects;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.StreamingOutput;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.TranscriptOfRecordsFileController;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.TranscriptOfRecordsFile;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/guider")
@RestCatchSchoolDataExceptions
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
  
  @Inject
  private TranscriptOfRecordsFileController torFileController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private SessionController sessionController;
  
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
  
  @GET
  @Path("/users/{IDENTIFIER}/files")
  @RESTPermit(GuiderPermissions.GUIDER_LIST_TORFILES)
  public Response listTranscriptOfRecordsFiles(@PathParam("IDENTIFIER") String identifierString) {
    SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(identifierString);
    UserEntity ue = userEntityController.findUserEntityByUserIdentifier(identifier);
    if (ue == null) {
      return Response.status(Status.NOT_FOUND).entity("User entity not found").build();
    }
    
    List<TranscriptOfRecordsFile> torFiles = torFileController.listFiles(ue);
    return Response.ok().entity(torFiles).build();
  }

  @DELETE
  @Path("/files/{ID}")
  @RESTPermit(GuiderPermissions.GUIDER_DELETE_TORFILE)
  public Response deleteTranscriptOfRecordsFile(@PathParam("ID") Long fileId) {
    TranscriptOfRecordsFile file = torFileController.findFileById(fileId);
    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("file not found").build();
    }
    
    torFileController.delete(file);
    return Response.status(Status.NO_CONTENT).build();
  }

  @GET
  @Path("/files/{ID}/content")
  @RESTPermit(GuiderPermissions.GUIDER_GET_TORFILE_CONTENT)
  public Response getTranscriptOfRecordsFileContent(@PathParam("ID") Long fileId) {
    
    TranscriptOfRecordsFile file = torFileController .findFileById(fileId);

    if (file == null) {
      return Response.status(Status.NOT_FOUND).entity("File not found").build();
    }
    
    StreamingOutput output = s -> torFileController.outputFileToStream(file, s);
    
    String contentType = file.getContentType();
    
    return Response.ok().type(contentType).entity(output).build();
  }
} 