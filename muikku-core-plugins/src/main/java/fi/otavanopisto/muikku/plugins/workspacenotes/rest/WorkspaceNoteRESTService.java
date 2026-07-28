package fi.otavanopisto.muikku.plugins.workspacenotes.rest;

import java.util.ArrayList;
import java.util.List;

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
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNoteType;
import fi.otavanopisto.muikku.plugins.workspacenotes.WorkspaceNoteController;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/workspacenotes")
@RestCatchSchoolDataExceptions
public class WorkspaceNoteRESTService extends PluginRESTService {

  private static final long serialVersionUID = 7446484926039078261L;

  @Inject
  private WorkspaceNoteController workspaceNoteController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;
  

  /*
   * Creates a new workspace note.
   *
   * Fields:
   * - title
   * - text
   * - workspaceEntityId
   * - workspaceMaterialId
   * - start
   * - end
   * - index
   * - type
   *
   * Example request:
   * {
   *   title: "Title here",
   *   text: "Text here",
   *   workspaceEntityId: 123,
   *   type: "WORKSPACE"
   * }
   *
   * Example request for WORKSPACE_MATERIAL:
   * {
   *   title: "Title here",
   *   text: "Text here",
   *   workspaceEntityId: 123,
   *   workspaceMaterialId: 456,
   *   type: "WORKSPACE_MATERIAL"
   * }
   *
   * Example request for WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT
   * or WORKSPACE_MATERIAL_CONTEXT_NOTE:
   * {
   *   title: "Title here",
   *   text: "Text here",
   *   workspaceEntityId: 123,
   *   workspaceMaterialId: 456,
   *   start: 10,
   *   end: 25,
   *   index: 0,
   *   type: "WORKSPACE_MATERIAL_CONTEXT_NOTE"
   * }
   *
   * Returns:
   * - Created WorkspaceNoteRestModel
   *
   * Example response:
   * {
   *   id: 1,
   *   owner: 1,
   *   title: "Title here",
   *   text: "Text here",
   *   workspaceEntityId: 123,
   *   workspaceMaterialId: null,
   *   start: null,
   *   end: null,
   *   index: null,
   *   type: "WORKSPACE"
   * }
   *
   * Errors:
   * - 400 Bad Request
   *     - workspaceEntityId is missing
   *     - Workspace entity does not exist
   *     - type is WORKSPACE_MATERIAL and workspaceMaterialId is missing
   *     - type is WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT or
   *       WORKSPACE_MATERIAL_CONTEXT_NOTE and start, end or index is missing
   */
  @POST
  @Path("/workspacenote/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceNote(WorkspaceNoteRestModel workspaceNote) {
    
    if (workspaceNote.getWorkspaceEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // WorkspaceMaterialId is required when type is WORKSPACE_MATERIAL
    if (workspaceNote.getType() == WorkspaceNoteType.WORKSPACE_MATERIAL && workspaceNote.getWorkspaceMaterialId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("WorkspaceMaterialId is required when type is WORKSPACE_MATERIAL").build();
    }
    
    // start, end and index are required when type is WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT or WORKSPACE_MATERIAL_CONTEXT_NOTE
    if (workspaceNote.getType() == WorkspaceNoteType.WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT || workspaceNote.getType() == WorkspaceNoteType.WORKSPACE_MATERIAL_CONTEXT_NOTE) {
      if (workspaceNote.getStart() == null || workspaceNote.getEnd() == null || workspaceNote.getIndex() == null) {
        return Response.status(Status.BAD_REQUEST).entity(String.format("Start, end and index are required with WorkspaceNoteType %s", workspaceNote.getType())).build();
      }
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceNote.getWorkspaceEntityId());
    
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace entity not found").build();
    }
    
    
    WorkspaceNote newWorkspaceNote = workspaceNoteController.createWorkspaceNote(
        sessionController.getLoggedUserEntity().getId(), 
        workspaceNote.getTitle(), 
        workspaceNote.getText(), 
        workspaceEntity.getId(), 
        workspaceNote.getWorkspaceMaterialId(), 
        workspaceNote.getStart(), 
        workspaceNote.getEnd(), 
        workspaceNote.getIndex(), 
        workspaceNote.getType());

    return Response.ok(toRestModel(newWorkspaceNote)).build();
  }
  
  /*
   * Updates an existing workspace note.
   *
   * Path parameter:
   * - id = workspace note id
   *
   * Request payload must contain:
   * - workspaceNoteId (must match path parameter)
   * - owner (must match existing note owner)
   * - workspaceEntityId (must match existing note workspaceEntityId)
   *
   * Editable fields:
   * - title
   * - text
   *
   * Example request:
   * {
   *   id: 123,
   *   owner: 14,
   *   workspaceEntityId: 23,
   *   title: "Updated title",
   *   text: "Updated note text"
   * }
   *
   * Returns:
   * - Updated WorkspaceNoteRestModel
   *
   * Errors:
   * - 400 Bad Request
   *     - Path id and payload id do not match
   *     - Owner is missing or does not match existing note owner
   *     - WorkspaceEntityId is missing or does not match existing note
   * - 404 Not Found
   *     - Workspace note not found
   * - 403 Forbidden
   *     - Logged in user is not the owner of the note
   */
  @PUT
  @Path ("/workspacenote/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateWorkspaceNote(@PathParam("ID") Long workspaceNoteId, WorkspaceNoteRestModel restModel) {
    
    if (!workspaceNoteId.equals(restModel.getId())) {
      return Response.status(Status.BAD_REQUEST).entity("Id mismatch").build();
    }
    
    WorkspaceNote workspaceNote = workspaceNoteController.findWorkspaceNoteById(workspaceNoteId);
    
    if (workspaceNote == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    if (restModel.getOwner() == null || !workspaceNote.getOwner().equals(restModel.getOwner())) {
      return Response.status(Status.BAD_REQUEST).entity("Owner mismatch").build();
    } 
    
    if (restModel.getWorkspaceEntityId() == null || !restModel.getWorkspaceEntityId().equals(workspaceNote.getWorkspaceEntityId())) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace entity id mismatch").build();
    }
    
    // Users can only update their own notes    
    
    if (!workspaceNote.getOwner().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    workspaceNote = workspaceNoteController.updateWorkspaceNote(workspaceNote, restModel.getTitle(), restModel.getText(), restModel.getType());
    
    return Response.ok(toRestModel(workspaceNote)).build();
  }
  
  private WorkspaceNoteRestModel toRestModel(WorkspaceNote workspaceNote) {
    WorkspaceNoteRestModel restModel = new WorkspaceNoteRestModel();
    restModel.setId(workspaceNote.getId());
    restModel.setOwner(workspaceNote.getOwner());
    restModel.setWorkspaceEntityId(workspaceNote.getWorkspaceEntityId());
    restModel.setTitle(workspaceNote.getTitle());
    restModel.setText(workspaceNote.getNote());
    restModel.setStart(workspaceNote.getStart());
    restModel.setEnd(workspaceNote.getEnd());
    restModel.setIndex(workspaceNote.getIndex());
    restModel.setWorkspaceMaterialId(workspaceNote.getWorkspaceMaterialId());
    restModel.setType(workspaceNote.getType());

    return restModel;
  }
  
  /*
   * Returns all non-archived workspace notes belonging to the specified user
   * in the specified workspace.
   *
   * Parameters:
   * - workspaceEntityId
   * - owner = userEntityId
   *
   * Returns:
   * - List<WorkspaceNoteRestModel>
   *
   * Access rules:
   * - Users can read their own notes.
   * - Administrators can read notes belonging to any user.
   *
   * Errors:
   * - 400 Bad Request
   *     - User does not exist
   *     - Workspace does not exist
   * - 403 Forbidden
   *     - Requested owner does not match the logged-in user and
   *       the logged-in user is not an administrator
   */
  @GET
  @Path("/workspace/{WORKSPACEID}/owner/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceNotesByWorkspaceAndOwner(@PathParam ("WORKSPACEID") Long workspaceEntityId, @PathParam("OWNER") Long owner) {

    if (userEntityController.findUserEntityById(owner) == null || workspaceEntityController.findWorkspaceEntityById(workspaceEntityId) == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Users can only access their own notes unless they are administrators
    
    if (!owner.equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<WorkspaceNote> workspaceNotes = workspaceNoteController.listByWorkspaceAndOwnerAndArchived(workspaceEntityId, owner, Boolean.FALSE);
    List<WorkspaceNoteRestModel> workspaceNoteList = new ArrayList<WorkspaceNoteRestModel>();
    
    for (WorkspaceNote workspaceNote : workspaceNotes) {
      WorkspaceNoteRestModel workspaceNoteRest = toRestModel(workspaceNote);
      workspaceNoteList.add(workspaceNoteRest);
    }
    
    return Response.ok(workspaceNoteList).build();
  }
  
  /* mApi() call (mApi().workspacenotes.archive.del(workspaceNoteId)) 
   * 
   * returns no content
   * 
   * Errors:
   * 404 Not found if can't find workspaceNote by id
   * 403 Forbidden if owner does not match with logged user
   * */
  
  @DELETE
  @Path ("/workspacenote/{ID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response archive(@PathParam("ID") Long workspaceNoteId) {
    WorkspaceNote workspaceNote = workspaceNoteController.findWorkspaceNoteById(workspaceNoteId);
    
    if (workspaceNote == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("WorkspaceNote(%d) not found", workspaceNoteId)).build();
    }
    
    // Archiving is only allowed if you're the owner of the workspace note

    if (!sessionController.getLoggedUserEntity().getId().equals(workspaceNote.getOwner())) {
        return Response.status(Status.FORBIDDEN).build();
    }

    workspaceNoteController.archive(workspaceNote);
    
    return Response
        .noContent()
        .build();

  }
  
} 