package fi.otavanopisto.muikku.plugins.notes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path ("/notes")
@RestCatchSchoolDataExceptions
public class NotesRESTService extends PluginRESTService {

  private static final long serialVersionUID = 6610657511716011677L;
  
  private static final int NOTES_FROM_THE_TIME = NumberUtils.createInteger(System.getProperty("muikku.notes.notesfromthetime", "14"));
  
  @Inject
  private NotesController notesController;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  

  // mApi() call (mApi().notes.note.create(noteRestModel)
  //
  // noteRestModel: = {
  //  title: String, 
  //  description: String, 
  //  type: enum MANUAL
  //  priority: enum LOW/NORMAL/HIGH, 
  //  pinned: Boolean, 
  //  owner: userEntityId
  //  };
  @POST
  @Path("/note")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response createNote(NoteRestModel note) {
    Note newNote = null;
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), sessionController.getLoggedUserEntity().getId(), note.getStartDate(), note.getDueDate());
    } else {
      newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), note.getOwner(), note.getStartDate(), note.getDueDate());
    }
    
    NoteRestModel noteRest = toRestModel(newNote);
    
    return Response.ok(noteRest).build();
  }
  
  //mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, pinned, dueDate & status)
  @PUT
  @Path ("/note/{NOTEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateNote(@PathParam ("NOTEID") Long noteId, NoteRestModel restModel) {
    
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
    UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(creator);
    Note updatedNote = null;
    
    if (creatorUSDI == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Student can edit only 'pinned' field if note is created by someone else
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && sessionController.getLoggedUserEntity().getId().equals(note.getOwner()) && !creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      updatedNote = notesController.updateNote(note, note.getTitle(), note.getDescription(), note.getPriority(), restModel.getPinned(), note.getStartDate(), note.getDueDate(), restModel.getStatus());
    } // Otherwise editing happens only if logged user equals with creator
    else if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNote = notesController.updateNote(note, restModel.getTitle(), restModel.getDescription(), restModel.getPriority(), restModel.getPinned(), restModel.getStartDate(), restModel.getDueDate(), restModel.getStatus());
    } 
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }
    NoteRestModel updatedRestModel = toRestModel(updatedNote);
    
    return Response.ok(updatedRestModel).build();
  }
  
  private NoteRestModel toRestModel(Note note) {
    
    UserEntity userEntity = userEntityController.findUserEntityById(note.getCreator());
    String creatorName = userEntityController.getName(userEntity, true).getDisplayNameWithLine();
    
    NoteRestModel restModel = new NoteRestModel();
    restModel.setId(note.getId());
    restModel.setTitle(note.getTitle());
    restModel.setDescription(note.getDescription());
    restModel.setType(note.getType());
    restModel.setPriority(note.getPriority());
    restModel.setPinned(note.getPinned());
    restModel.setOwner(note.getOwner());
    restModel.setCreator(note.getCreator());
    restModel.setCreatorName(creatorName);
    restModel.setCreated(note.getCreated());
    restModel.setStartDate(note.getStartDate());
    restModel.setDueDate(note.getDueDate());
    restModel.setStatus(note.getStatus());
    restModel.setIsArchived(note.getArchived());

    return restModel;
  }
  
  //mApi() call (mApi().notes.owner.read(owner))
  @GET
  @Path("/owner/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByOwner(@PathParam("OWNER") Long owner, @QueryParam("listArchived") @DefaultValue ("false") Boolean listArchived) {

    List<Note> notes = notesController.listByOwner(owner, listArchived);
    List<NoteRestModel> notesList = new ArrayList<NoteRestModel>();
    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && !owner.equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    for (Note note : notes) {
      UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
      UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(creator);
      
      if (creatorUSDI == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }

      // Ignore archived notes older than last two weeks
      if (Boolean.TRUE.equals(listArchived) && note.getLastModified().before(Date.from(inLastTwoWeeks.toInstant()))) {
        continue;
      }
      
      // Do not return students' personal notes to staff 
      if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        continue;
      }

      NoteRestModel noteRest = toRestModel(note);
      notesList.add(noteRest);
    }
    
    return Response.ok(notesList).build();
  }
  
  // mApi() call (mApi().notes.note.toggleArchived.update(noteId))
  // In this case archiving means moving note to 'trash'. So it's only update method and user can restore the note.
  @PUT
  @Path ("/note/{NOTEID}/toggleArchived")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleArchived(@PathParam ("NOTEID") Long noteId) {
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
    }
    
    // Students can only archive their own notes
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && !note.getCreator().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build(); 
    }
    
    // Archiving is only allowed if you're the creator or owner of the note
    if ((!sessionController.getLoggedUserEntity().getId().equals(note.getCreator()))) {
      if (!sessionController.getLoggedUserEntity().getId().equals(note.getOwner())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    NoteRestModel noteRestModel = toRestModel(notesController.toggleArchived(note));
    return Response.ok(noteRestModel).build();

  }
} 