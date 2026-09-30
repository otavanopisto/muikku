package fi.otavanopisto.muikku.plugins.evaluation;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.evaluation.model.EvaluationNote;
import fi.otavanopisto.muikku.plugins.evaluation.rest.model.EvaluationNoteRestModel;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/evaluationNotes")
@RestCatchSchoolDataExceptions
public class EvaluationNoteRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5322962199136805813L;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private EvaluationController evaluationController;

  @POST
  @Path("/note")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createOrUpdateEvaluationNote(EvaluationNoteRestModel payload) {

    // Validation
    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (payload.getUserEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing student").build();
    }
    
    if (payload.getWorkspaceEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing workspace").build();
    }
    
    if (StringUtils.isBlank(payload.getNote())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing note").build();
    }
    
    // Access check
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(payload.getWorkspaceEntityId());
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    EvaluationNote note = null;
    
    // Create or update
    if (payload.getId() != null) {
      note = evaluationController.findEvaluationNoteById(payload.getId());
      
      if (note != null) {
        note = evaluationController.updateEvaluationNote(note, payload.getNote(), sessionController.getLoggedUserEntity().getId(), new Date());
      }
    } else {
      note = evaluationController.createEvaluationNote(payload.getWorkspaceEntityId(), payload.getUserEntityId(), sessionController.getLoggedUserEntity().getId(), payload.getNote(), NoteType.MANUAL, new Date()); 
    }
    return Response.ok(toRestModel(note)).build();
  }

  private EvaluationNoteRestModel toRestModel(EvaluationNote note) {

    UserEntity creatorEntity = userEntityController.findUserEntityById(note.getCreator());
    String creatorName = userEntityController.getName(creatorEntity, true).getDisplayNameWithLine();
    
    String lastModifierName = null;
    
    if (note.getLastModifier() != null) {
      UserEntity lastModifierEntity = userEntityController.findUserEntityById(note.getLastModifier());
      lastModifierName = userEntityController.getName(lastModifierEntity, true).getDisplayNameWithLine();
    }
    
    EvaluationNoteRestModel restModel = new EvaluationNoteRestModel();
    restModel.setId(note.getId());
    restModel.setNote(note.getNote());
    restModel.setUserEntityId(note.getUserEntityId());
    restModel.setWorkspaceEntityId(note.getWorkspaceEntityId());
    restModel.setCreator(note.getCreator());
    restModel.setCreatorName(creatorName);
    restModel.setCreated(note.getCreated());
    restModel.setLastModified(note.getLastModified());
    restModel.setLastModifier(note.getLastModifier());
    restModel.setLastModifierName(lastModifierName);

    return restModel;
  }

  @GET
  @Path("/workspaces/{WORKSPACE}/students/{STUDENT}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByWorkspaceAndStudent(@PathParam("WORKSPACE") Long workspaceEntityId, @PathParam("STUDENT") Long userEntityId) {

    // Validation 
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);

    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
    
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Access check
    
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    // List notes by creator
    List<EvaluationNote> notes = evaluationController.listEvaluationNotesByStudentAndWorkspace(workspaceEntityId, userEntityId);

    List<EvaluationNoteRestModel> noteList = new ArrayList<EvaluationNoteRestModel>();

    for (EvaluationNote note : notes) {
      noteList.add(toRestModel(note));
    }

    return Response.ok(noteList).build();
  }
  
  @DELETE
  @Path ("/note/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response archive(@PathParam("ID") Long evaluationNoteId) {
    EvaluationNote evaluationNote = evaluationController.findEvaluationNoteById(evaluationNoteId);
    
    if (evaluationNote == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Evaluation note(%d) not found", evaluationNoteId)).build();
    }
    
    // Access check
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(evaluationNote.getWorkspaceEntityId());
    if (!sessionController.hasWorkspacePermission(MuikkuPermissions.VIEW_USER_EVALUATION, workspaceEntity)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    evaluationController.archiveEvaluationNote(evaluationNote);
    
    return Response
        .noContent()
        .build();

  }

}