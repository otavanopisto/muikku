package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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

  
  @POST
  @Path("/messages")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createNote(NoteRestModel note) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Status.UNAUTHORIZED).build();
    }
    
    try {
      SchoolDataIdentifier loggedUser = sessionController.getLoggedUser();
      NoteType type = NoteType.MANUAL;
      NotePriority priority = NotePriority.LOW;
      Note newNote = notesController.createNote(note.getTitle(), note.getDescription(), type, priority, false, note.getOwner(), loggedUser.toString(), new Date(), null, null, false);
      return Response.ok(restModel(newNote)).build();
    }
    catch (Exception e) {
      e.printStackTrace();
      logger.log(Level.SEVERE, "Couldn't create new note.", e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    } 
  }
  
  
  
  private NoteRestModel restModel(Note note) {
    NoteRestModel restModel = new NoteRestModel(note.getId(), note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), note.getOwner(), note.getCreator(), note.getCreated(), note.getLastModifier(), note.getLastModified(), note.getArchived());

    return restModel;
  }
  
  @GET
  @Path("/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getNotesByOwner(@PathParam("OWNER") String owner) {
    
    // permissions
    
    if (owner == null) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid userIdentifier").build();
    }
    List<Note> notes = notesController.listBy(owner);
    
    return Response.ok(notes).build();
  }

} 