package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.security.MuikkuPermissionCollection;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/notes")
@RestCatchSchoolDataExceptions
public class NotesRESTService extends PluginRESTService {

  private static final long serialVersionUID = 6610657511716011677L;
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;
  
  @Inject
  private NotesController notesController;

  // mApi() call (mApi().notes.note.create(noteRestModel)
  //
  // noteRestModel: = {
  //  title: String, 
  //  description: String, 
  //  priority: enum LOW/NORMAL/HIGH, 
  //  pinned: Boolean, 
  //  owner: userIdentifier,
  //  creator: loggedUser
  //  };
  @POST
  @Path("/note")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createNote(NoteRestModel note) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(NotesPermissions.NOTES_MANAGE)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    try {
      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      
      Note newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), note.getOwner(), loggedUser.toString(), new Date());
      return Response.ok(restModel(newNote)).build();
    }
    catch (Exception e) {
      e.printStackTrace();
      logger.log(Level.SEVERE, "Couldn't create new note.", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } 
  }
  
  //mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority and pinned)
  @PUT
  @Path ("/note/{NOTEID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateNote(@PathParam ("NOTEID") Long noteId, NoteRestModel restModel) {
    
    //permissions 
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    if (!sessionController.hasEnvironmentPermission(NotesPermissions.NOTES_MANAGE)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    notesController.updateNote(note, restModel.getTitle(), restModel.getDescription(), restModel.getPriority(), restModel.getPinned());
  
    return Response.noContent().build();
  }
  
  
  
  private NoteRestModel restModel(Note note) {
    NoteRestModel restModel = new NoteRestModel(note.getId(), note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), note.getOwner(), note.getCreator(), note.getCreated(), note.getLastModifier(), note.getLastModified(), note.getArchived());

    return restModel;
  }
  
  //mApi() call (mApi().notes.read(owner))
  @GET
  @Path("/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getNotesByOwner(@PathParam("OWNER") String owner) {
    
    // permissions
    if (!sessionController.hasEnvironmentPermission(NotesPermissions.NOTES_VIEW)) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    if (owner == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    List<Note> notes = notesController.listBy(owner);
    
    return Response.ok(notes).build();
  }
  
  // mApi() call (mApi().notes.note.del(noteId))
  
  @DELETE
  @Path ("/note/{NOTEID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response archiveNote(@PathParam ("NOTEID") Long noteId) {
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
    }
    
    // permissions
    if (!note.getOwner().equals(sessionController.getLoggedUser().toString()) || !sessionController.hasEnvironmentPermission(NotesPermissions.NOTES_MANAGE)){
      return Response.status(Status.FORBIDDEN).build();
    }

      notesController.archiveNote(note);
      
      return Response.noContent().build();
  }

} 