package fi.otavanopisto.muikku.plugins.notes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
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
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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
    
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
    EnvironmentRoleArchetype loggedUserRole = roleEntity != null ? roleEntity.getArchetype() : null;
    
    if (loggedUserRole == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    Note newNote = null;
    
    if (EnvironmentRoleArchetype.STUDENT.equals(loggedUserRole)) {
      newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), sessionController.getLoggedUserEntity().getId(), note.getDueDate());
    } else {
      newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getPinned(), note.getOwner(), note.getDueDate());
    }
    
    return Response.ok(toRestModel(newNote)).build();
  }
  
  //mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, pinned, dueDate & status)
  @PUT
  @Path ("/note/{NOTEID}")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateNote(@PathParam ("NOTEID") Long noteId, NoteRestModel restModel) {
    
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    EnvironmentRoleArchetype loggedUserRole = getUserRoleArchetype(sessionController.getLoggedUser());
    UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
    EnvironmentRoleArchetype creatorRole = getUserRoleArchetype(creator.defaultSchoolDataIdentifier());
    Note updatedNote = null;
    
    if (loggedUserRole == null || creatorRole == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Student can edit only 'pinned' field if note is created by someone else
    if (loggedUserRole.equals(EnvironmentRoleArchetype.STUDENT) && sessionController.getLoggedUserEntity().getId().equals(note.getOwner()) && !creatorRole.equals(EnvironmentRoleArchetype.STUDENT)) {
      updatedNote = notesController.updateNote(note, note.getTitle(), note.getDescription(), note.getPriority(), restModel.getPinned(), note.getDueDate(), restModel.getStatus());
    } // Otherwise editing happens only if logged user equals with creator
    else if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNote = notesController.updateNote(note, restModel.getTitle(), restModel.getDescription(), restModel.getPriority(), restModel.getPinned(), restModel.getDueDate(), restModel.getStatus());
    } 
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    return Response.ok(toRestModel(updatedNote)).build();
  }
  
  private NoteRestModel toRestModel(Note note) {
    
    UserEntity userEntity = userEntityController.findUserEntityById(note.getCreator());
    String creatorName = userEntityController.getName(userEntity).getDisplayNameWithLine();

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
    restModel.setDueDate(note.getDueDate());
    restModel.setStatus(note.getStatus());

    return restModel;
  }
  
  //mApi() call (mApi().notes.owner.read(owner))
  @GET
  @Path("/owner/{OWNER}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response getNotesByOwner(@PathParam("OWNER") Long owner, @QueryParam("listArchived") @DefaultValue ("false") Boolean listArchived) {

    List<Note> notes = notesController.listByOwner(owner, listArchived);
    List<NoteRestModel> notesList = new ArrayList<NoteRestModel>();
    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);
    
    for (Note note : notes) {
      NoteRestModel noteRest = toRestModel(note);
      
      UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
      EnvironmentRoleArchetype creatorUserRole = getUserRoleArchetype(creator.defaultSchoolDataIdentifier());
      EnvironmentRoleArchetype loggedUserRole = getUserRoleArchetype(sessionController.getLoggedUser());
      
      if (loggedUserRole == null || creatorUserRole == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }
      
      if (Boolean.TRUE.equals(listArchived)) {
        if (!note.getLastModified().before(Date.from(inLastTwoWeeks.toInstant()))) {
          if (loggedUserRole.equals(EnvironmentRoleArchetype.STUDENT)) {
            notesList.add(noteRest);
          } else {
            if (!creatorUserRole.equals(EnvironmentRoleArchetype.STUDENT)) {
              notesList.add(noteRest);
            }
          }
        }
      } else {
        if (loggedUserRole.equals(EnvironmentRoleArchetype.STUDENT)) {
          notesList.add(noteRest);
        } else {
          if (!creatorUserRole.equals(EnvironmentRoleArchetype.STUDENT)) {
            notesList.add(noteRest);
          } 
        }
      }
    }
    
    return Response.ok(notesList).build();
  }
  
  private EnvironmentRoleArchetype getUserRoleArchetype(SchoolDataIdentifier userSchoolDataIdentifier) {
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userSchoolDataIdentifier);
    EnvironmentRoleArchetype userRoleArchetype = roleEntity != null ? roleEntity.getArchetype() : null;
    return userRoleArchetype;
  }
  
  // mApi() call (mApi().notes.note.archive.update(noteId))
  // In this case archiving means moving note to 'trash'. So it's only update method and user can restore the note.
  @PUT
  @Path ("/note/{NOTEID}/archive")
  @RESTPermit(handling = Handling.INLINE)
  public Response updateArchived(@PathParam ("NOTEID") Long noteId) {
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
    }
    
    // permissions
    if ((!sessionController.getLoggedUserEntity().getId().equals(note.getCreator()))) {
      if (!sessionController.getLoggedUserEntity().getId().equals(note.getOwner())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    Note updatedNote = notesController.updateArchived(note);
    if(note.getArchived().equals(Boolean.FALSE)) {
      note.setDueDate(null);
    }
    return Response.ok(toRestModel(updatedNote)).build();
  }
} 