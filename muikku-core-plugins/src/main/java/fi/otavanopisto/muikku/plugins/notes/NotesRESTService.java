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
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.communicator.UserRecipientController;
import fi.otavanopisto.muikku.plugins.communicator.UserRecipientList;
import fi.otavanopisto.muikku.plugins.guider.RecipientListRESTModel;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;
import fi.otavanopisto.muikku.schooldata.RestCatchSchoolDataExceptions;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityName;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@RequestScoped
@Stateful
@Produces("application/json")
@Path("/notes")
@RestCatchSchoolDataExceptions
public class NotesRESTService extends PluginRESTService {

  private static final long serialVersionUID = 6610657511716011677L;

  private static final int NOTES_FROM_THE_TIME = NumberUtils
      .createInteger(System.getProperty("muikku.notes.notesfromthetime", "14"));

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
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserEntityFileController userEntityFileController;
  // mApi() call (mApi().notes.note.create(noteRestModelWithRecipients)
  //
  // noteRestModelWithRecipients{
  // "recipients": {
  // "recipientIds": [],
  // "recipientGroupIds": [3]
  // },
  // "note": {
  // "title": "<p>Ryhmälappu</p>",
  // "description": "Tämä menee ryhmälle!",
  // "startDate": "2024-12-11T10:15:30+01:00",
  // "dueDate": "2025-01-01T10:15:30+01:00",
  // "priority": "HIGH",
  // "type": "MANUAL"
  // },
  // "noteReceiver":{
  // "pinned": "false"
  // }
  // }

  @POST
  @Path("/note")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createNote(NoteWithRecipientsRestModel payload) {

    NoteRestModel note = payload.getNote();

    Note newNote = null;
    NoteReceiver newReceiver = null;
    List<NoteReceiverRestModel> receiverList = new ArrayList<NoteReceiverRestModel>();

    Boolean pinned = payload.isPinned();

    // Recipient handling

    RecipientListRESTModel recipientPayload = payload.getRecipients();

    if (recipientPayload != null) {

      // Note creation by student
      if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        // Students can create notes only for themselves, so there should be only one
        // receiver in the payload
        if (recipientPayload.getRecipientIds().size() != 1) {
          return Response.status(Status.BAD_REQUEST).build();
        }

        if (recipientPayload.getRecipientIds().get(0) != sessionController.getLoggedUserEntity().getId()) {
          return Response.status(Status.BAD_REQUEST).entity("Student and note recipient does not match").build();
        }
        newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(),
            note.getStartDate(), note.getDueDate(), false);

        newReceiver = noteReceiverController.createNoteRecipient(pinned,
            sessionController.getLoggedUserEntity().getId(), newNote, null, null);
        receiverList.add(toRestModel(newReceiver));

      }
      else { // Note creation by staff
        UserRecipientList prepareRecipientList = prepareRecipientList(recipientPayload);

        if (prepareRecipientList == null || !prepareRecipientList.hasRecipients()) {
          return Response.status(Status.BAD_REQUEST).entity("No recipients").build();
        }

        Boolean multiUserNote = Boolean.FALSE;

        // If the note is created for a user group or workspace, it must always be a
        // multi-user note, even if the group or workspace contains only one person.
        if (recipientPayload.getRecipientIds().size() != 1) {
          multiUserNote = Boolean.TRUE;
        }
        else {
          if (!prepareRecipientList.getStudentWorkspaces().isEmpty() || !prepareRecipientList.getUserGroups().isEmpty())
            multiUserNote = Boolean.TRUE;
        }

        newNote = notesController.createNote(note.getTitle(), note.getDescription(), note.getType(), note.getPriority(),
            note.getStartDate(), note.getDueDate(), multiUserNote);

        // userRecipients

        for (UserEntity userRecipient : prepareRecipientList.getUserRecipients()) {
          newReceiver = noteReceiverController.createNoteRecipient(pinned, userRecipient.getId(), newNote, null, null);
          receiverList.add(toRestModel(newReceiver));
        }

        // User groups
        for (UserGroupEntity userGroup : prepareRecipientList.getUserGroups()) {

          Long userGroupId = userGroup.getId();

          List<UserEntity> groupUsers = prepareRecipientList.getUserGroupRecipients(userGroup);

          if (!CollectionUtils.isEmpty(groupUsers)) {
            for (UserEntity groupUser : groupUsers) {
              UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
                  .findUserSchoolDataIdentifierByUserEntity(groupUser);
              if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
                continue;
              }
              newReceiver = noteReceiverController.createNoteRecipient(pinned, groupUser.getId(), newNote, userGroupId,
                  null);
              receiverList.add(toRestModel(newReceiver));
            }
          }
        }

        // Workspace members

        for (WorkspaceEntity workspaceEntity : prepareRecipientList.getStudentWorkspaces()) {
          List<UserEntity> workspaceUsers = prepareRecipientList.getWorkspaceStudentRecipients(workspaceEntity);

          if (!CollectionUtils.isEmpty(workspaceUsers)) {
            for (UserEntity workspaceUserEntity : workspaceUsers) {
              UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
                  .findUserSchoolDataIdentifierByUserEntity(workspaceUserEntity);
              if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
                continue;
              }
              newReceiver = noteReceiverController.createNoteRecipient(pinned, workspaceUserEntity.getId(), newNote,
                  null, workspaceEntity.getId());
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

  private UserRecipientList prepareRecipientList(RecipientListRESTModel recipientPayload) {

    if (recipientPayload != null) {
      List<UserEntity> recipientList = new ArrayList<UserEntity>();

      for (Long recipientId : recipientPayload.getRecipientIds()) {
        UserEntity recipient = userEntityController.findUserEntityById(recipientId);

        if (recipient != null) {
          recipientList.add(recipient);
        }
      }

      List<UserGroupEntity> userGroupRecipients = null;
      UserGroupEntity group = null;

      // user groups
      if (!CollectionUtils.isEmpty(recipientPayload.getRecipientGroupIds())) {
        userGroupRecipients = new ArrayList<UserGroupEntity>();

        for (Long groupId : recipientPayload.getRecipientGroupIds()) {
          group = userGroupEntityController.findUserGroupEntityById(groupId);
          userGroupRecipients.add(group);
        }
      }

      // workspaces
      List<WorkspaceEntity> workspaceStudentRecipients = null;

      if (!CollectionUtils.isEmpty(recipientPayload.getRecipientStudentsWorkspaceIds())) {
        workspaceStudentRecipients = new ArrayList<WorkspaceEntity>();
        WorkspaceEntity workspaceEntity = null;
        for (Long workspaceId : recipientPayload.getRecipientStudentsWorkspaceIds()) {
          workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
          workspaceStudentRecipients.add(workspaceEntity);
        }
      }
      // The recipients of notes are always only students
      List<EnvironmentRoleArchetype> roles = new ArrayList<EnvironmentRoleArchetype>();
      roles.add(EnvironmentRoleArchetype.STUDENT);

      // Filter recipients
      UserRecipientList prepareRecipientList = userRecipientController.prepareRecipientList(
          sessionController.getLoggedUserEntity(), recipientList, userGroupRecipients, workspaceStudentRecipients, null,
          roles);

      return prepareRecipientList;
    }

    return null;
  }

  // mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, startDate, dueDate)
  @PUT
  @Path("/note/{NOTEID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateNote(@PathParam("NOTEID") Long noteId, NoteWithRecipientsRestModel payload) {

    Note note = notesController.findNoteById(noteId);

    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
    UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierByUserEntity(creator);
    Note updatedNote = null;

    if (creatorUSDI == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    NoteRestModel notePayload = payload.getNote();

    if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNote = notesController.updateNote(note, notePayload.getTitle(), notePayload.getDescription(),
          notePayload.getPriority(), notePayload.getStartDate(), notePayload.getDueDate());
    }
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Add/remove recipients (Only available to staff)

    if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      if (payload.getRecipients() != null) {

        if (!payload.getRecipients().getRecipientGroupIds().isEmpty()
            || !payload.getRecipients().getRecipientIds().isEmpty()
            || !payload.getRecipients().getRecipientStudentsWorkspaceIds().isEmpty()) {

          // Filter duplicates
          UserRecipientList prepareRecipientList = prepareRecipientList(payload.getRecipients());

          if (prepareRecipientList == null || !prepareRecipientList.hasRecipients()) {
            return Response.status(Status.BAD_REQUEST).entity("No recipients").build();
          }

          // Individual recipients

          for (UserEntity userRecipient : prepareRecipientList.getUserRecipients()) {

            NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(userRecipient.getId(), updatedNote);

            if (receiver == null) {
              noteReceiverController.createNoteRecipient(false, userRecipient.getId(), updatedNote, null, null);
            }
            else {
              // Remove only if receiver is user-specific
              if (receiver.getRecipientGroup() == null && receiver.getWorkspaceId() == null) {
                noteReceiverController.deleteRecipient(receiver);
              }
              else {
                // If the receiver already exists, we need to make it user-specific and set the
                // user group and workspace IDs to null
                noteReceiverController.updateNoteWorkspaceAndUserGroup(receiver, null, null);
              }
            }
          }

          // User groups
          for (UserGroupEntity userGroup : prepareRecipientList.getUserGroups()) {
            
            List<NoteReceiver> receivers = noteReceiverController.listReceiversByNoteAndUserGroup(updatedNote,
                userGroup.getId());

            // If there are any note recipients associated with a selected user group, they
            // should all be deleted at once
            if (!CollectionUtils.isEmpty(receivers)) {
              for (NoteReceiver receiver : receivers) {
                noteReceiverController.deleteRecipient(receiver);
              }
            } else {
            List<UserEntity> preparedUserGroupRecipients = prepareRecipientList.getUserGroupRecipients(userGroup);

            for (UserEntity userEntity : preparedUserGroupRecipients) {
              if (userEntity != null) {
                UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userEntity.defaultSchoolDataIdentifier());

                if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
                  continue;
                }

                NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(userEntity.getId(),
                    updatedNote);

                if (receiver == null) {
                  noteReceiverController.createNoteRecipient(false, userEntity.getId(), updatedNote,
                      userGroup.getId(), null);
                }
                else {
                  // Remove receiver only if it's originally added with a user group id
                  if (receiver.getRecipientGroup() != null) {
                    noteReceiverController.deleteRecipient(receiver);
                  }
                }
              }
            }
          }
          }

          // Workspace members

          for (WorkspaceEntity workspaceEntity : prepareRecipientList.getStudentWorkspaces()) {

            List<NoteReceiver> receivers = noteReceiverController.listReceiversByNoteAndWorkspace(updatedNote,
                workspaceEntity.getId());

            // If there are any note recipients associated with a selected workspace, they
            // should all be deleted at once
            if (!CollectionUtils.isEmpty(receivers)) {
              for (NoteReceiver receiver : receivers) {
                noteReceiverController.deleteRecipient(receiver);
              }
            }
            else {
              List<UserEntity> workspaceUsers = prepareRecipientList.getWorkspaceStudentRecipients(workspaceEntity);

              if (!CollectionUtils.isEmpty(workspaceUsers)) {
                for (UserEntity workspaceUserEntity : workspaceUsers) {
                  UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController
                      .findUserSchoolDataIdentifierByUserEntity(workspaceUserEntity);
                  if (!userSchoolDataIdentifier.hasRole(EnvironmentRoleArchetype.STUDENT)) {
                    continue;
                  }

                  NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(workspaceUserEntity.getId(),
                      updatedNote);

                  if (receiver == null) {
                    noteReceiverController.createNoteRecipient(false, workspaceUserEntity.getId(), updatedNote, null,
                        workspaceEntity.getId());
                  }
                }
              }
            }
          }
        }
      }
    }

    // To rest model
    NoteRestModel updatedRestModel = toRestModel(updatedNote);

    List<NoteReceiverRestModel> recipientsRest = new ArrayList<NoteReceiverRestModel>();
    List<NoteReceiver> recipients = noteReceiverController.listByNote(note);

    for (NoteReceiver recipient : recipients) {
      recipientsRest.add(toRestModel(recipient));
    }

    updatedRestModel.setRecipients(recipientsRest);

    return Response.ok(updatedRestModel).build();
  }

  // mApi() call (mApi().notes.note.update(noteId, noteRestModel)
  // Editable fields are title, description, priority, dueDate)
  @PUT
  @Path("/note/{NOTEID}/receiver/{NOTERECEIVERID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateNoteReceiver(@PathParam("NOTEID") Long noteId, @PathParam("NOTERECEIVERID") Long receiverId,
      NoteReceiverRestModel payload) {

    Note note = notesController.findNoteById(noteId);

    if (note == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    NoteReceiver noteReceiver = noteReceiverController.findByRecipientIdAndNote(receiverId, note);

    if (noteReceiver == null) {
      return Response.status(Status.NOT_FOUND).build();
    }

    UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
    UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierByUserEntity(creator);
    NoteReceiver updatedNoteReceiver = null;

    if (creatorUSDI == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Student can edit only 'pinned' (+ status between APPROVAL_PENDING and
    // ONGOING) field if note is created by someone else
    if (sessionController.getLoggedUserEntity().getId().equals(noteReceiver.getRecipient())) {
      NoteStatus status = noteReceiver.getStatus();
      if (noteReceiver.getStatus() != payload.getStatus()) {
        if (noteReceiver.getStatus() == NoteStatus.ONGOING) {
          status = NoteStatus.APPROVAL_PENDING;
        }

        if (noteReceiver.getStatus() == NoteStatus.APPROVAL_PENDING) {
          status = NoteStatus.ONGOING;
        }
      }
      updatedNoteReceiver = noteReceiverController.updateNoteRecipient(noteReceiver, payload.getPinned(), status);
    } // Otherwise editing happens only if logged user equals with creator
    else if (sessionController.getLoggedUserEntity().getId().equals(note.getCreator())) {
      updatedNoteReceiver = noteReceiverController.updateNoteRecipient(noteReceiver, payload.getPinned(),
          payload.getStatus());
    }
    else {
      return Response.status(Status.BAD_REQUEST).build();
    }

    return Response.ok(toRestModel(updatedNoteReceiver)).build();
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
    restModel.setMultiUserNote(note.getMultiUserNote());

    return restModel;
  }

  private NoteReceiverRestModel toRestModel(NoteReceiver noteReceiver) {
    String groupName = null;
    WorkspaceEntityName workspaceName = null;
    Boolean hasImage = false;
    if (noteReceiver.getRecipientGroup() != null) {
      UserGroupEntity userGroupEntity = userGroupEntityController
          .findUserGroupEntityById(noteReceiver.getRecipientGroup());

      if (userGroupEntity != null) {
        UserGroupEntityName usergroup = userGroupEntityController.getName(userGroupEntity);

        groupName = usergroup.getName();
      }
    }

    if (noteReceiver.getWorkspaceId() != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(noteReceiver.getWorkspaceId());

      if (workspaceEntity != null) {

        workspaceName = workspaceEntityController.getName(workspaceEntity);
      }
    }
    String recipientName = null;

    UserEntity userEntity = userEntityController.findUserEntityById(noteReceiver.getRecipient());

    if (userEntity != null) {
      recipientName = userEntityController.getName(userEntity, true).getDisplayName();
      hasImage = userEntityFileController.hasProfilePicture(userEntity);
    }

    NoteReceiverRestModel restModel = new NoteReceiverRestModel();
    restModel.setId(noteReceiver.getId());
    restModel.setNoteId(noteReceiver.getNote().getId());
    restModel.setPinned(noteReceiver.getPinned());
    restModel.setRecipient(noteReceiver.getRecipient());
    restModel.setRecipientName(recipientName);
    restModel.setStatus(noteReceiver.getStatus());
    restModel.setUserGroupId(noteReceiver.getRecipientGroup());
    restModel.setUserGroupName(groupName);
    restModel.setWorkspaceId(noteReceiver.getWorkspaceId());
    restModel.setWorkspaceName(workspaceName.getName());
    restModel.setHasImage(hasImage);

    return restModel;
  }

  @GET
  @Path("/recipient/{RECIPIENTID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByRecipient(@PathParam("RECIPIENTID") Long recipient,
      @QueryParam("listArchived") @DefaultValue("false") Boolean listArchived) {

    UserEntity recipientEntity = userEntityController.findUserEntityById(recipient);

    if (recipientEntity == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)
        && !recipient.equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<Note> notes = notesController.listByReceiver(recipientEntity, listArchived);

    List<NoteRestModel> notesList = new ArrayList<NoteRestModel>();
    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);


    for (Note note : notes) {
      UserEntity creator = userEntityController.findUserEntityById(note.getCreator());
      UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController
          .findUserSchoolDataIdentifierByUserEntity(creator);

      if (creatorUSDI == null) {
        return Response.status(Status.BAD_REQUEST).build();
      }

      // Ignore archived notes older than last two weeks
      if (Boolean.TRUE.equals(listArchived) && note.getLastModified().before(Date.from(inLastTwoWeeks.toInstant()))) {
        continue;
      }

      // Do not return students' personal notes to staff
      if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)
          && creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        continue;
      }

      // recipients

      NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(recipient, note);

      if (receiver == null) {
        return Response.status(Status.NOT_FOUND)
            .entity(String.format("Recipient (%d) not found", sessionController.getLoggedUserEntity().getId())).build();
      }

      List<NoteReceiverRestModel> recipientListRest = new ArrayList<NoteReceiverRestModel>();
      NoteRestModel noteRest = toRestModel(note);
      
      recipientListRest.add(toRestModel(receiver));
      
      noteRest.setRecipients(recipientListRest);

      notesList.add(noteRest);
    }

    return Response.ok(notesList).build();
  }

  @GET
  @Path("/creator/{CREATORID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listNotesByCreator(@PathParam("CREATORID") Long creatorId,
      @QueryParam("listArchived") @DefaultValue("false") Boolean listArchived) {

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

    List<NoteRestModel> notesList = new ArrayList<NoteRestModel>();

    OffsetDateTime inLastTwoWeeks = OffsetDateTime.now().minusDays(NOTES_FROM_THE_TIME);

    UserEntity creator = userEntityController.findUserEntityById(userEntity.getId());
    
    UserSchoolDataIdentifier creatorUSDI = userSchoolDataIdentifierController
        .findUserSchoolDataIdentifierByUserEntity(creator);

    if (creatorUSDI == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    for (Note note : notes) {
      // Ignore archived notes older than last two weeks
      if (Boolean.TRUE.equals(listArchived) && note.getLastModified().before(Date.from(inLastTwoWeeks.toInstant()))) {
        continue;
      }

      // Do not return students' personal notes to staff
      if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)
          && creatorUSDI.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        continue;
      }

      // recipients

      List<NoteReceiver> recipients = noteReceiverController.listByNote(note);
      List<NoteReceiverRestModel> recipientListRest = new ArrayList<NoteReceiverRestModel>();
      NoteRestModel noteRest = toRestModel(note);

      for (NoteReceiver recipient : recipients) {
        recipientListRest.add(toRestModel(recipient));
      }
      noteRest.setRecipients(recipientListRest);

      notesList.add(noteRest);
    }

    return Response.ok(notesList).build();
  }

  // mApi() call (mApi().notes.note.toggleArchived.update(noteId))
  // In this case archiving means moving note to 'trash'. So it's only update
  // method and user can restore the note.
  @PUT
  @Path("/note/{NOTEID}/toggleArchived")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response toggleArchived(@PathParam("NOTEID") Long noteId) {
    Note note = notesController.findNoteById(noteId);

    if (note == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
    }

    // Students can only archive their own notes
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)
        && !note.getCreator().equals(sessionController.getLoggedUserEntity().getId())) {
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

    List<NoteReceiverRestModel> recipientsRest = new ArrayList<NoteReceiverRestModel>();
    for (NoteReceiver recipient : recipients) {
      recipientsRest.add(toRestModel(recipient));
    }

    noteRestModel.setRecipients(recipientsRest);

    return Response.ok(noteRestModel).build();

  }

  // mApi() call (notes.note.recipient.delete(noteId, recipientId))
  // In this case, archiving means permanent deletion. Once deleted, the data
  // cannot be restored.
  @DELETE
  @Path("/note/{NOTEID}/recipient/{RECIPIENTID}")
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteReceiver(@PathParam("NOTEID") Long noteId, @PathParam("RECEIVERID") Long receiverId) {
    Note note = notesController.findNoteById(noteId);

    if (note == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note (%d) not found", noteId)).build();
    }
    
    // Users can only delete recipients from their own notes.
    if (!note.getCreator().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Status.FORBIDDEN).build();
    }

    NoteReceiver receiver = noteReceiverController.findByRecipientIdAndNote(receiverId, note);

    if (receiver == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Note recipient (%d) not found", receiverId))
          .build();
    }

    noteReceiverController.deleteRecipient(receiver);

    return Response.status(Status.NO_CONTENT).build();

  }

}