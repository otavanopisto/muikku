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

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.UserRecipientController;
import fi.otavanopisto.muikku.plugins.communicator.UserRecipientList;
import fi.otavanopisto.muikku.plugins.guider.RecipientListRESTModel;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
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
  
  @Inject
  private NoteReceiverController noteReceiverController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserRecipientController userRecipientController;
  
  @Inject
  private UserGroupController userGroupController;
  

//mApi() call (mApi().notes.note.create(noteRestModelWithRecipients)
//
//  noteRestModelWithRecipients{
//    "recipients": {
//        "recipientIds": [],
//        "recipientGroupIds": [3]
//    },
//    "note": {
//        "title": "<p>Ryhmälappu</p>",
//        "description": "Tämä menee ryhmälle!",
//        "startDate": "2024-12-11T10:15:30+01:00",
//        "dueDate": "2025-01-01T10:15:30+01:00",
//        "priority": "HIGH",
//        "type": "MANUAL"
//    },
//    "noteReceiver":{
//        "pinned": "false"
//    }
//}
 
 @POST
 @Path("/note")
 @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
 public Response createNote(NoteWithRecipientsRestModel payload) {
   
   NoteRestModel note = payload.getNote();
   
   Note newNote = null;
   NoteReceiver newReceiver = null;
   List<NoteReceiverRestModel> receiverList = new ArrayList<NoteReceiverRestModel>();

   Boolean pinned = payload.getNoteReceiver().getPinned();
   
   UserEntity userEntity = sessionController.getLoggedUserEntity();

   // Recipient handling
   
   List<UserEntity> recipientList = new ArrayList<UserEntity>();

   RecipientListRESTModel recipientPayload = payload.getRecipients();
   
   if (recipientPayload != null) {
     
     // Student creates own notes
     if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
       // Students can create notes only for themselves, so there should be only one receiver in the payload
       if (recipientPayload.getRecipientIds().size() != 1) {
         return Response.status(Status.BAD_REQUEST).build();
       }
       
       if (recipientPayload.getRecipientIds().get(0) != sessionController.getLoggedUserEntity().getId()) {
         return Response.status(Status.BAD_REQUEST).entity("Student and note recipient does not match").build();
       }
       newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getStartDate(), note.getDueDate());
       
       newReceiver = noteReceiverController.createNoteRecipient(pinned, sessionController.getLoggedUserEntity().getId(), newNote, null);
       receiverList.add(toRestModel(newReceiver));
       
     } else {
       for (Long recipientId : recipientPayload.getRecipientIds()) {
         UserEntity recipient = userEntityController.findUserEntityById(recipientId);
         
         if (recipient != null) {
           recipientList.add(recipient);
         } else {
           return Response.status(Status.BAD_REQUEST).build();
         }
       }
     }
     
     List<UserGroupEntity> userGroupRecipients = null;
     UserGroupEntity group = null;
     
     if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
       // user groups
       if (!CollectionUtils.isEmpty(recipientPayload.getRecipientGroupIds())) {
         userGroupRecipients = new ArrayList<UserGroupEntity>();
         
         for (Long groupId : recipientPayload.getRecipientGroupIds()) {
           group = userGroupEntityController.findUserGroupEntityById(groupId);
           userGroupRecipients.add(group);
         }
       }
     
       // The recipients of notes are always only students
       List<EnvironmentRoleArchetype> roles = new ArrayList<EnvironmentRoleArchetype>();
       roles.add(EnvironmentRoleArchetype.STUDENT);
       
       // Filter recipients
       UserRecipientList prepareRecipientList = userRecipientController.prepareRecipientList(
           userEntity, recipientList, userGroupRecipients, null, null, roles);
   
   
       if (!prepareRecipientList.hasRecipients()) {
         return Response.status(Status.BAD_REQUEST).entity("No recipients").build();
       }
       
       newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(), note.getStartDate(), note.getDueDate());
       
       // userRecipients
       
       for (UserEntity userRecipient : prepareRecipientList.getUserRecipients()) {
         newReceiver = noteReceiverController.createNoteRecipient(pinned, userRecipient.getId(), newNote, null);
         receiverList.add(toRestModel(newReceiver));
       }
       
       // User groups
       for (UserGroupEntity userGroup : prepareRecipientList.getUserGroups()) {
         prepareRecipientList.getUserGroupRecipients(userGroup);
         
         List<UserGroupUserEntity> ugue = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup);
         
         for (UserGroupUserEntity userGroupUserEntity : ugue) {
           
           if (userGroupUserEntity != null) {
             UserSchoolDataIdentifier userSchoolDataIdentifier = userGroupUserEntity.getUserSchoolDataIdentifier();
             
             UserEntity groupRecipientEntity = userSchoolDataIdentifier.getUserEntity();
             
             newReceiver = noteReceiverController.createNoteRecipient(pinned, groupRecipientEntity.getId(), newNote, userGroupUserEntity.getUserGroupEntity().getId());
             receiverList.add(toRestModel(newReceiver));
           }
         }
       }
       
     }
   }
   
   NoteRestModel noteRest = toRestModel(newNote);
   noteRest.setRecipients(receiverList);
   
   return Response.ok(noteRest).build();
 }
  
  //mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, pinned, dueDate & status)
  @PUT
  @Path ("/note/{NOTEID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateNote(@PathParam ("NOTEID") Long noteId, NoteRestModel restModel) {
    
    Note note = notesController.findNoteById(noteId);
    
    NoteReceiver noteReceiver = noteReceiverController.findByRecipientIdAndNote(sessionController.getLoggedUserEntity().getId(), note);
    
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
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && sessionController.getLoggedUserEntity().getId().equals(noteReceiver.getRecipient()) && !creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      updatedNote = notesController.updateNote(note, note.getTitle(), note.getDescription(), note.getPriority(), note.getStartDate(), note.getDueDate());
    } // Otherwise editing happens only if logged user equals with creator
    else if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNote = notesController.updateNote(note, restModel.getTitle(), restModel.getDescription(), restModel.getPriority(), restModel.getStartDate(), restModel.getDueDate());
    } 
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }
    NoteRestModel updatedRestModel = toRestModel(updatedNote);
    
    return Response.ok(updatedRestModel).build();
  }
  
  //mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, dueDate)
  @PUT
  @Path ("/note/{NOTEID}/receiver/{NOTERECEIVERID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateNoteReceiver(@PathParam ("NOTEID") Long noteId, @PathParam ("NOTERECEIVERID") Long receiverId, NoteReceiverRestModel payload) {
    
    Note note = notesController.findNoteById(noteId);
    
    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    NoteReceiver noteReceiver = noteReceiverController.findByRecipientIdAndNote(receiverId, note);
    
    if (noteReceiver == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    
    UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
    UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(creator);
    NoteReceiver updatedNoteReceiver = null;
    
    if (creatorUSDI == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Student can edit only 'pinned' field if note is created by someone else
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && !creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      updatedNoteReceiver = noteReceiverController.updateNoteRecipient(noteReceiver, payload.getPinned(), noteReceiver.getStatus());
    } // Otherwise editing happens only if logged user equals with creator
    else if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNoteReceiver = noteReceiverController.updateNoteRecipient(noteReceiver, payload.getPinned(), payload.getStatus());
    } 
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }
    NoteReceiverRestModel restModel = toRestModel(updatedNoteReceiver);
    
    return Response.ok(restModel).build();
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
    restModel.setCreator(note.getCreator());
    restModel.setCreatorName(creatorName);
    restModel.setCreated(note.getCreated());
    restModel.setStartDate(note.getStartDate());
    restModel.setDueDate(note.getDueDate());
    restModel.setIsArchived(note.getArchived());

    return restModel;
  }
  
  private NoteReceiverRestModel toRestModel(NoteReceiver noteReceiver) {
    String groupName = null;
    
    if (noteReceiver.getRecipientGroup() != null) {
      UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(noteReceiver.getRecipientGroup());
    
      if (userGroupEntity != null) {
        UserGroup usergroup = userGroupController.findUserGroup(userGroupEntity);
        
        groupName = usergroup.getName();
      }
    }
    NoteReceiverRestModel restModel = new NoteReceiverRestModel();
    restModel.setId(noteReceiver.getId());
    restModel.setNoteId(noteReceiver.getNote().getId());
    restModel.setPinned(noteReceiver.getPinned());
    restModel.setRecipient(noteReceiver.getRecipient());
    restModel.setStatus(noteReceiver.getStatus());
    restModel.setUserGroupId(noteReceiver.getRecipientGroup());
    restModel.setUserGroupName(groupName);

    return restModel;
  }
  
  //mApi() call (mApi().notes.owner.read(owner))
  @GET
  @Path("/recipient/{RECIPIENT}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByRecipient(@PathParam("RECIPIENT") Long recipient, @QueryParam("listArchived") @DefaultValue ("false") Boolean listArchived) {

    UserEntity recipientEntity = userEntityController.findUserEntityById(recipient);
    
    if (recipientEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    List<Note> notes = notesController.listByReceiver(recipientEntity);

    List<NoteRestModel> notesList = new ArrayList<NoteRestModel>();
    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && !recipient.equals(sessionController.getLoggedUserEntity().getId())) {
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

      // recipients
      
      NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(recipient, note);
      
      if (receiver == null) {
        return Response.status(Status.NOT_FOUND).entity(String.format("Recipient (%d) not found", sessionController.getLoggedUserEntity().getId())).build();
      }
      
      List<NoteReceiverRestModel> recipientListRest = new ArrayList<NoteReceiverRestModel>();
      NoteRestModel noteRest = toRestModel(note);
      
      NoteReceiverRestModel recipientRest = toRestModel(receiver);
        
      recipientListRest.add(recipientRest);
      noteRest.setRecipients(recipientListRest);
      
      notesList.add(noteRest);
    }
    
    return Response.ok(notesList).build();
  }
  
  //mApi() call (mApi().notes.owner.read(owner))
  @GET
  @Path("/creator/{CREATORID}")
  @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByCreator(@PathParam("CREATORID") Long creatorId, @QueryParam("listArchived") @DefaultValue ("false") Boolean listArchived) {

    UserEntity userEntity = userEntityController.findUserEntityById(creatorId);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Users can only list notes created by themselves
    if (!userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // List notes by creator
    List<Note> notes = notesController.listByCreator(userEntity, listArchived);

    NoteSortedListRestModel notesListSorted = new NoteSortedListRestModel();

    // Lists for private notes and multi user notes
    List<NoteRestModel> notesListMulti = new ArrayList<NoteRestModel>();
    List<NoteRestModel> notesListSingle = new ArrayList<NoteRestModel>();

    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);


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
      
      // recipients
      
      List<NoteReceiver> recipients = noteReceiverController.listByNote(note);
      List<NoteReceiverRestModel> recipientListRest = new ArrayList<NoteReceiverRestModel>();
      NoteRestModel noteRest = toRestModel(note);
      
      for (NoteReceiver recipient : recipients) {
        NoteReceiverRestModel recipientRest = toRestModel(recipient);
        
        recipientListRest.add(recipientRest);
      }
      noteRest.setRecipients(recipientListRest);
      
      if (recipientListRest.size() == 1) {
        notesListSingle.add(noteRest);
      } else {
        notesListMulti.add(noteRest);
      }
      notesListSorted.setPrivateNotes(notesListSingle);
      notesListSorted.setMultiUserNotes(notesListMulti);
    }
    
    return Response.ok(notesListSorted).build();
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
    
    List<NoteReceiver> recipients = noteReceiverController.listByNote(note);
    NoteReceiver receiver = null;
    
    // Archiving is only allowed if you're the creator or owner of the note
    if ((!sessionController.getLoggedUserEntity().getId().equals(note.getCreator()))) {
      
      if (recipients.size() == 1) {
        receiver = recipients.get(0);
      }
      if (receiver == null || !sessionController.getLoggedUserEntity().getId().equals(receiver.getId())) {
        return Response.status(Status.FORBIDDEN).build();
      }
    }

    NoteRestModel noteRestModel = toRestModel(notesController.toggleArchived(note));
    return Response.ok(noteRestModel).build();

  }
  
  //mApi() call (notes.note.recipient.delete(noteId, recipientId))
 // In this case, archiving means permanent deletion. Once deleted, the data cannot be restored.
 @DELETE
 @Path ("/note/{NOTEID}/recipient/{RECIPIENTID}/delete")
 @RESTPermit (handling = Handling.INLINE, requireLoggedIn = true)
 public Response deleteReceiver(@PathParam ("NOTEID") Long noteId, @PathParam ("RECEIVERID") Long receiverId) {
   Note note = notesController.findNoteById(noteId);
   
   if (note == null) {
     return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
   }
   
   NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(receiverId, note);

   if (receiver == null) {
     return Response.status(Status.NOT_FOUND).entity(String.format("Note recipient (%d) not found", receiverId)).build();
   }
   
   // Users can only delete recipients from their own notes.
   if (!note.getCreator().equals(sessionController.getLoggedUserEntity().getId())) {
     return Response.status(Status.FORBIDDEN).build(); 
   }

   noteReceiverController.deleteRecipient(receiver);
   
   return Response.status(Status.NO_CONTENT).build();

 }
  
} 