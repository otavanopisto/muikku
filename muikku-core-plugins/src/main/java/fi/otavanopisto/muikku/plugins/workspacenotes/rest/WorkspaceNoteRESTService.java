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
   * mApi() call (mApi().workspacenotes.workspacenote.create(workspaceEntityId, workspaceNoteRestModel)
   * 
   * Editable fields: 
   * 
   * WorkspaceNoteRestModel: = { 
   * title: "title here",
   * workspaceNote: "text here",
   * workspaceEntityId: 123,
   * nextSiblingId: 12
   * };
   * 
   * returns:
   * 
   * WorkspaceNoteRestModel: = { 
   * id: 1,
   * title: "title here"
   * workspaceNote: "text here",
   * workspaceEntityId: 123,
   * owner: 1
   * };
   * 
   * Errors:
   * 400 Bad request if workspaceEntityId is null
   */
  
  @POST
  @Path("/workspacenote/")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createWorkspaceNote(WorkspaceNoteRestModel workspaceNote) {
    
    if (workspaceNote.getWorkspaceEntityId() == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceNote.getWorkspaceEntityId());
    
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace entity not found").build();
    }
    
    WorkspaceNote referenceNote = null;
    if (workspaceNote.getNextSiblingId() != null) {
      referenceNote = workspaceNoteController.findWorkspaceNoteById(workspaceNote.getNextSiblingId());
    }
    
    WorkspaceNote newWorkspaceNote = workspaceNoteController.createWorkspaceNote(sessionController.getLoggedUserEntity().getId(), workspaceNote.getTitle(), workspaceNote.getWorkspaceNote(), workspaceEntity.getId(), referenceNote);

    return Response.ok(toRestModel(newWorkspaceNote)).build();
  }
  
  /*
   * mApi() call mApi().workspacenotes.workspacenote.update(123, WorkspaceNoteRestModel) 
   *  
   *  Parameter rest model must contain owner, workspaceEntityId & nextSiblingId. 
   *  
   *  example:
   *  {owner: 14, workspaceEntityId: 23, title: "Title", workspaceNote: "updatedNote", nextSiblingId: 2}
   *  
   *  
   *  Editable fields are only title, workspaceNote & nextSiblingId
   *  
   *  returns updated rest model
   *  
   *  WorkspaceNoteRestModel: = { 
   *    id: 1,
   *    title: "updated title here",
   *    workspaceNote: "updated text here",
   *    workspaceEntityId: 123,
   *    owner: 1
   * };
   *  
   *  Errors:
   *  404 Not found if workspaceNote not found
   *  400 Bad request if userEntityId is null or note id doesn't match payload
   *  403 Forbidden if userEntityId does not match with logged user
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
    
    if (restModel.getWorkspaceEntityId() == null || !restModel.getWorkspaceEntityId().equals(workspaceNote.getWorkspace())) {
      return Response.status(Status.BAD_REQUEST).entity("Workspace entity id mismatch").build();
    }
    
    // Users can only update their own notes    
    
    if (!workspaceNote.getOwner().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    WorkspaceNote referenceNote = null;
    
    if (restModel.getNextSiblingId() != null) {
      referenceNote = workspaceNoteController.findWorkspaceNoteById(restModel.getNextSiblingId());
    }
    
    if (referenceNote == null) {
      Integer maximumOrderNumber = workspaceNoteController.getMaximumOrderNumberByOwnerAndWorkspace(restModel.getWorkspaceEntityId(), restModel.getOwner());
      workspaceNote = workspaceNoteController.updateOrderNumber(workspaceNote, ++maximumOrderNumber);
    } else {
      workspaceNote = workspaceNoteController.moveAbove(workspaceNote, referenceNote);
    }
    
    workspaceNote = workspaceNoteController.updateWorkspaceNote(workspaceNote, restModel.getTitle(), restModel.getWorkspaceNote());
    
    return Response.ok(toRestModel(workspaceNote)).build();
  }
  
  private WorkspaceNoteRestModel toRestModel(WorkspaceNote workspaceNote) {
    WorkspaceNote nextSibling = workspaceNoteController.findWorkspaceNoteNextSibling(workspaceNote);
    Long nextSiblingId = nextSibling != null ? nextSibling.getId() : null;
    
    WorkspaceNoteRestModel restModel = new WorkspaceNoteRestModel();
    restModel.setId(workspaceNote.getId());
    restModel.setOwner(workspaceNote.getOwner());
    restModel.setWorkspaceEntityId(workspaceNote.getWorkspace());
    restModel.setTitle(workspaceNote.getTitle());
    restModel.setWorkspaceNote(workspaceNote.getNote());
    restModel.setNextSiblingId(nextSiblingId);

    return restModel;
  }
  
  /* mApi() call (mApi().workspacenotes.owner.read(userEntityId)) 
   * 
   * returns a list of user's notes from all workspaces
   * 
   * WorkspaceNoteRestModel: = { 
   * id: 1,
   * title: "title here",
   * workspaceNote: "text here",
   * workspaceEntityId: 123,
   * owner: 1
   * };
   * 
   * Errors:
   * 
   * 400 Bad request if owner is null
   * 403 Forbidden if userEntityId does not match with logged user
   * */
  @GET
  @Path("/owner/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceNotesByOwner(@PathParam("OWNER") Long owner) {

    if (userEntityController.findUserEntityById(owner) == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // non-admins can only list their own notes
    
    if (!owner.equals(sessionController.getLoggedUserEntity().getId())) {
      if (!sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    List<WorkspaceNote> workspaceNotes = workspaceNoteController.listByOwnerAndArchived(owner, Boolean.FALSE);
    List<WorkspaceNoteRestModel> workspaceNoteList = new ArrayList<WorkspaceNoteRestModel>();
    
    for (WorkspaceNote workspaceNote : workspaceNotes) {
      WorkspaceNoteRestModel workspaceNoteRest = toRestModel(workspaceNote);
      workspaceNoteList.add(workspaceNoteRest);
    }
    
    return Response.ok(workspaceNoteList).build();
  }
  
  /* mApi() call (mApi().workspacenotes.workspace.owner.read(workspaceEntityId, userEntityId)) 
   * 
   * returns a list of user's notes from the specific workspace
   * 
   * WorkspaceNoteRestModel: = { 
   * id: 1,
   * title: "title here",
   * workspaceNote: "text here",
   * workspaceEntityId: 123,
   * owner: 1
   * };
   * 
   * Errors:
   * 
   * 400 Bad request if owner is null
   * 403 Forbidden if owner does not match with logged user
   * */
  @GET
  @Path("/workspace/{WORKSPACEID}/owner/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listWorkspaceNotesByWorkspaceAndOwner(@PathParam ("WORKSPACEID") Long workspaceEntityId, @PathParam("OWNER") Long owner) {

    if (userEntityController.findUserEntityById(owner) == null || workspaceEntityController.findWorkspaceEntityById(workspaceEntityId) == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // users can only edit their own notes
    
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