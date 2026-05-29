package fi.otavanopisto.muikku.plugins.event;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventParticipantDAO;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventPropertyDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventContainerDAO;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventDAO;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.EventAttendance;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventProperty;
import fi.otavanopisto.muikku.plugins.event.rest.MuikkuEventPropertyRestModel;
import fi.otavanopisto.muikku.plugins.event.rest.MuikkuEventRestModel;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.StudentGuidanceRelation;
import fi.otavanopisto.muikku.plugins.event.model.EventType;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class MuikkuEventController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private MuikkuEventDAO eventDAO;

  @Inject
  private MuikkuEventContainerDAO eventContainerDAO;

  @Inject
  private MuikkuEventParticipantDAO eventParticipantDAO;

  @Inject
  private MuikkuEventPropertyDAO muikkuEventPropertyDAO;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  public List<MuikkuEvent> createEvents(MuikkuEventRestModel restEvent, List<Long> users,
      MuikkuEventContainer payloadContainer) {

    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    WorkspaceEntity workspaceEntity = null;
    boolean isStudent = userEntityController.isStudent(loggedUserEntity);

    boolean isWorkspaceContainer = payloadContainer.getWorkspaceEntityId() != null;

    if (isWorkspaceContainer) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(payloadContainer.getWorkspaceEntityId());
    }
    List<MuikkuEvent> createdEvents = new ArrayList<>();

    List<Long> userIds = (users != null && !users.isEmpty())
        ? users
        : List.of(restEvent.getUserEntityId());
    
    if (userIds != null && !userIds.isEmpty()) {
      for (Long userId : userIds) {
        UserEntity userEntity = userEntityController.findUserEntityById(userId);
        if (userEntity == null) {
          continue;
        }
  
        // Relation checks etc
        if (!canCreateEvent(userEntity, isStudent, isWorkspaceContainer, workspaceEntity)) {
          continue;
        }
        
        // Event creation
        MuikkuEvent event = eventDAO.create(
            new Date(restEvent.getStart().toInstant().toEpochMilli()),
            new Date(restEvent.getEnd().toInstant().toEpochMilli()), 
            restEvent.isAllDay(), 
            restEvent.getTitle(),
            restEvent.getDescription(), 
            EventType.valueOf(restEvent.getType()), 
            userEntity.getId(),
            loggedUserEntity.getId(), 
            restEvent.isEditable(), 
            restEvent.isPrivate(), 
            restEvent.isRemovable(),
            payloadContainer);
  
        // properties
        if (restEvent.getProperties() != null) {
          for (MuikkuEventPropertyRestModel restProperty : restEvent.getProperties()) {
            createEventProperty(
                event, 
                restProperty.getName(), 
                restProperty.getValue(), 
                loggedUserEntity.getId(),
                new Date());
          }
        }
        createdEvents.add(event);
      }
    }
    return createdEvents;
  }

  public MuikkuEvent updateEvent(MuikkuEvent event, OffsetDateTime start, OffsetDateTime end, boolean allDay,
      String title, String description, EventType type, boolean editableByUser, boolean isPrivate,
      boolean removableByUser) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.update(event, startDate, endDate, allDay, title, description, type, editableByUser, isPrivate,
        removableByUser);
  }

  public void deleteEvent(MuikkuEvent event) {
    // We also remove all stuff that reference this event

    // Referencing events
    List<MuikkuEvent> events = eventDAO.listByReferenceEvent(event);

    if (events != null) {
      for (MuikkuEvent referencingEvent : events) {
        eventDAO.delete(referencingEvent);
      }
    }

    // Participants
    List<MuikkuEventParticipant> participants = eventParticipantDAO.listByEvent(event);
    for (MuikkuEventParticipant participant : participants) {
      eventParticipantDAO.delete(participant);
    }

    // Properties
    List<MuikkuEventProperty> properties = muikkuEventPropertyDAO.listByEvent(event);

    for (MuikkuEventProperty property : properties) {
      muikkuEventPropertyDAO.delete(property);
    }

    eventDAO.delete(event);
  }

  public MuikkuEventContainer createEventContainer(Long workspaceEntityId, Long userEntityId, String name) {
    return eventContainerDAO.create(workspaceEntityId, userEntityId, name);
  }

  public MuikkuEventContainer updateEventContainer(MuikkuEventContainer eventContainer, Long workspaceEntityId,
      Long userEntityId, String name) {
    return eventContainerDAO.update(eventContainer, workspaceEntityId, userEntityId, name);
  }

  public void updateEventAttendance(MuikkuEventParticipant participant, EventAttendance attendance) {
    eventParticipantDAO.updateAttendance(participant, attendance);
  }

  public MuikkuEvent findEventById(Long eventId) {
    return eventDAO.findById(eventId);
  }

  public MuikkuEventContainer findEventContainerById(Long eventContainerId) {
    return eventContainerDAO.findById(eventContainerId);
  }

  public MuikkuEventContainer findEventContainerByUserOrWorkspace(Long userEntityId, Long workspaceEntityId) {
    if (userEntityId != null) {
      return eventContainerDAO.findByUser(userEntityId);
    }
    else {
      return eventContainerDAO.findByWorkspace(workspaceEntityId);
    }
  }

  public boolean isEventParticipant(MuikkuEvent event, Long userEntityId) {
    return eventParticipantDAO.findByEventAndParticipant(event, userEntityId) != null;
  }

  public void removeParticipant(MuikkuEventParticipant participant) {
    eventParticipantDAO.delete(participant);
  }

  public MuikkuEventParticipant findParticipant(MuikkuEvent event, Long userEntityId) {
    return eventParticipantDAO.findByEventAndParticipant(event, userEntityId);
  }

  public List<MuikkuEventParticipant> listParticipants(MuikkuEvent event) {
    return eventParticipantDAO.listByEvent(event);
  }

  /**
   * Sets the participants of an event. This method only adds and removes
   * participants. All new participants will have attendance UNCONFIRMED. All
   * existing participants will keep the attendance they currently have.
   * 
   * @param event
   *          The event
   * @param participants
   *          The participants of the event
   */
  public void setParticipants(MuikkuEvent event, List<MuikkuEventParticipant> participants) {

    List<MuikkuEventParticipant> oldParticipants = eventParticipantDAO.listByEvent(event);

    // Add participants

    for (MuikkuEventParticipant participant : participants) {
      MuikkuEventParticipant oldParticipant = findParticipantByUserEntityId(oldParticipants,
          participant.getUserEntityId());
      if (oldParticipant == null) {
        eventParticipantDAO.create(event, participant.getUserEntityId(), EventAttendance.UNCONFIRMED);
      } else {
        oldParticipants.remove(oldParticipant);
      }
    }

    // Remove participants

    for (MuikkuEventParticipant oldParticipant : oldParticipants) {
      MuikkuEventParticipant newParticipant = findParticipantByUserEntityId(participants,
          oldParticipant.getUserEntityId());
      if (newParticipant == null) {
        eventParticipantDAO.delete(oldParticipant);
      }
    }
  }

  public List<MuikkuEvent> listByUserAndWorkspaceAndTimeframeAndType(Long userEntityId, Long workspaceEntityId,
      OffsetDateTime start, OffsetDateTime end, EventType type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.listByUserAndWorkspaceAndTimeframeAndType(userEntityId, workspaceEntityId, startDate, endDate,
        type);
  }

  private MuikkuEventParticipant findParticipantByUserEntityId(List<MuikkuEventParticipant> participants,
      Long userEntityId) {
    return participants.stream().filter(p -> userEntityId.equals(p.getUserEntityId())).findFirst().orElse(null);
  }

  public boolean canViewEventContainer(
      MuikkuEventContainer container,
      UserEntity targetUserEntity) {

    if (container == null) {
      return false;
    }

    UserEntity loggedUser = sessionController.getLoggedUserEntity();

    // Admin
    if (sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return true;
    }

    // User container
    if (container.getUserEntityId() != null) {

      if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        return loggedUser.getId().equals(container.getUserEntityId());
      }

      return true;
    }

    // Workspace container
    Long workspaceEntityId = container.getWorkspaceEntityId();

    if (workspaceEntityId == null) {
      return false;
    }

    // Logged user belongs to workspace
    boolean ownWorkspaceAccess =
        workspaceUserEntityController
            .listActiveWorkspaceEntitiesByUserEntity(loggedUser)
            .stream()
            .map(WorkspaceEntity::getId)
            .anyMatch(id -> id.equals(workspaceEntityId));

    if (ownWorkspaceAccess) {
      return true;
    }

    // Relation-based access
    if (targetUserEntity != null) {

      SchoolDataIdentifier identifier =
          targetUserEntity.defaultSchoolDataIdentifier();

      StudentGuidanceRelation relation =
          userController.getGuidanceRelation(
              identifier.getDataSource(),
              identifier.getIdentifier());

      if (relation != null &&
          (relation.isGuidanceCounselor()
              || relation.isCourseTeacher()
              || relation.isStudentParent())) {

        boolean targetInWorkspace =
            workspaceUserEntityController
                .listActiveWorkspaceEntitiesByUserEntity(targetUserEntity)
                .stream()
                .map(WorkspaceEntity::getId)
                .anyMatch(id -> id.equals(workspaceEntityId));

        return targetInWorkspace;
      }
    }

    return false;
  }

  public boolean canViewEvent(UserEntity userEntity, MuikkuEvent event) {

    // Private event
    if (event.isPrivate()) {
      return event.getCreatorEntityId().equals(userEntity.getId());
    }

    // Own events
    if (event.getUserEntityId() != null && event.getUserEntityId().equals(userEntity.getId())) {
      return true;
    }
    
    // Event creators can always view events they created
    if (event.getCreatorEntityId() != null
        && event.getCreatorEntityId().equals(userEntity.getId())) {
      return true;
    }
    
    // DEFAULT event without target user -> visible
    if (event.getUserEntityId() == null && event.getType() == EventType.DEFAULT) {
      return true;
    }

    // Admin
    if (sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR)) {
      return true;
    }


    // A null check is needed at this point to avoid a NullPointerException when checking relations etc
    if (event.getUserEntityId() == null) {
      return false;
    }

    UserEntity targetUserEntity = userEntityController.findUserEntityById(
        event.getUserEntityId());

    if (targetUserEntity == null) {
      return false;
    }
    
    // Relations
    SchoolDataIdentifier identifier = targetUserEntity.defaultSchoolDataIdentifier();

    StudentGuidanceRelation relation = userController.getGuidanceRelation(identifier.getDataSource(),
        identifier.getIdentifier());

    boolean guidanceCounselor = false;
    boolean courseTeacher = false;
    boolean studentParent = false;
    
    if (relation != null) {
      guidanceCounselor = relation.isGuidanceCounselor();
      courseTeacher = relation.isCourseTeacher();
      studentParent = relation.isStudentParent();
    }
    
    // You can't edit an event if you can't access the container.
    // container access
    if (event.getEventContainer() != null) {
      if (!canViewEventContainer(event.getEventContainer(), targetUserEntity)) {
        return false;
      }
    }

    // Course teacher check
    if (courseTeacher && relation != null) {
      courseTeacher = hasSharedWorkspacesWithLoggedUser(targetUserEntity);
    }

    // Absence
    if (event.getType() == EventType.ABSENCE) {

      if (!(guidanceCounselor || courseTeacher || studentParent)) {
        return false;
      }
    }

    // other relations
    if (guidanceCounselor || courseTeacher || studentParent) {
      return true;
    }

    return false;
  }
  
  private boolean canCreateEvent(
      UserEntity targetUserEntity,
      boolean isStudent,
      boolean isWorkspaceContainer,
      WorkspaceEntity workspaceEntity) {

    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();

    // Workspace-specific events
    if (isWorkspaceContainer) {

      if (!workspaceUserEntityController.isWorkspaceMember(
          targetUserEntity.defaultSchoolDataIdentifier(),
          workspaceEntity)) {
        return false;
      }

      // student → only self
      if (isStudent && !loggedUserEntity.getId().equals(targetUserEntity.getId())) {
        return false;
      }

      SchoolDataIdentifier identifier = targetUserEntity.defaultSchoolDataIdentifier();

      StudentGuidanceRelation relation =
          userController.getGuidanceRelation(identifier.getDataSource(), identifier.getIdentifier());

      boolean guidanceCounselor = false;
      boolean courseTeacher = false;
      boolean studentParent = false;

      if (relation != null) {
        guidanceCounselor = relation.isGuidanceCounselor();
        courseTeacher = relation.isCourseTeacher();
        studentParent = relation.isStudentParent();
      }

      if (courseTeacher) {

        if (!loggedUserEntity.getId().equals(targetUserEntity.getId())) {
          return hasSharedWorkspacesWithLoggedUser(targetUserEntity);
        }

        return true;
      }

      boolean hasAdminOrLeaderRole =
          sessionController.hasAnyRole(
              EnvironmentRoleArchetype.ADMINISTRATOR,
              EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);

      if (!studentParent && !hasAdminOrLeaderRole && !guidanceCounselor) {
        return false;
      }

      return true;
    }

    // User-specific events
    else {

      // Student -> only self
      if (isStudent) {
        return loggedUserEntity.getId().equals(targetUserEntity.getId());
      }

      SchoolDataIdentifier identifier = targetUserEntity.defaultSchoolDataIdentifier();

      StudentGuidanceRelation relation =
          userController.getGuidanceRelation(identifier.getDataSource(), identifier.getIdentifier());

      boolean studentParent = false;
      boolean isStaffRole = sessionController.hasAnyRole(
          EnvironmentRoleArchetype.ADMINISTRATOR,
          EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
          EnvironmentRoleArchetype.TEACHER,
          EnvironmentRoleArchetype.STUDY_GUIDER
      );

      if (relation != null) {
        studentParent = relation.isStudentParent();
      }

      if (userEntityController.isStudent(targetUserEntity) && (studentParent || isStaffRole)) {
        return true;
      }

      return false;
    }
  }

  public boolean canEditEvent(WorkspaceEntity workspaceEntity, MuikkuEvent event) {

    UserEntity loggedUser = sessionController.getLoggedUserEntity();

    boolean isAdmin = sessionController.hasRole(EnvironmentRoleArchetype.ADMINISTRATOR);

    // Admin always
    if (isAdmin) {
      return true;
    }

    // creator always
    if (event.getCreatorEntityId().equals(loggedUser.getId())) {
      return true;
    }

    // student & StudentParent
    if (sessionController.hasAnyRole(
        EnvironmentRoleArchetype.STUDENT,
        EnvironmentRoleArchetype.STUDENT_PARENT)) {

      boolean isOwnEvent = event.getUserEntityId() == loggedUser.getId();

      // non-editable events owned by another user cannot be edited
      if (!isOwnEvent && !event.isEditableByUser()) {
        return false;
      }

      boolean editableOwnEvent =
          event.isEditableByUser()
              && event.getType() != EventType.ABSENCE
              && isOwnEvent;

      if (editableOwnEvent) {
        return true;
      }
    }

    // You can't edit an event if you can't access the container.
    if (event.getEventContainer() != null) {
      UserEntity targetUserEntity = userEntityController.findUserEntityById(event.getUserEntityId());
      if (!canViewEventContainer(event.getEventContainer(), targetUserEntity)) {
        return false;
      }
    }

    Set<Long> loggedUserWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(loggedUser)
        .stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());

    // User event
    if (event.getUserEntityId() != null) {
      UserEntity userEntity = userEntityController.findUserEntityById(event.getUserEntityId());
      SchoolDataIdentifier identifier = userEntity.defaultSchoolDataIdentifier();

      StudentGuidanceRelation relation = userController.getGuidanceRelation(identifier.getDataSource(),
          identifier.getIdentifier());
      // Teacher absence edit
      boolean courseTeacher = false;

      if (relation != null && relation.isCourseTeacher()) {
        courseTeacher = hasSharedWorkspacesWithLoggedUser(userEntity);
      }

      // teacher can edit absence events for their students
      if (courseTeacher && event.getType() == EventType.ABSENCE) {
        return true;
      }
    }

    // Workspace event
    if (workspaceEntity != null) {
      // Staff members has access if they are workspace members
      if (!sessionController.hasAnyRole(EnvironmentRoleArchetype.STUDENT, EnvironmentRoleArchetype.STUDENT_PARENT)) {
        if (loggedUserWorkspaceIds.contains(workspaceEntity.getId())) {
          return true;
        }
      }
    }

    return false;
  }

  public List<MuikkuEventProperty> listPropertiesByEvent(MuikkuEvent event) {
    return muikkuEventPropertyDAO.listByEvent(event);
  }

  public MuikkuEventProperty createEventProperty(MuikkuEvent event, String name, String value, Long userEntityId,
      Date date) {
    return muikkuEventPropertyDAO.create(event, name, value, userEntityId, date);
  }

  public MuikkuEventProperty updateEventProperty(MuikkuEventProperty property, String value, Date date) {
    return muikkuEventPropertyDAO.update(property, value, date);
  }

  public MuikkuEventProperty findEventPropertyById(Long eventPropertyId) {
    return muikkuEventPropertyDAO.findById(eventPropertyId);
  }

  public MuikkuEventProperty findEventProperty(Long id) {
    return muikkuEventPropertyDAO.findById(id);
  }

  public void deleteEventProperty(MuikkuEventProperty property) {
    muikkuEventPropertyDAO.delete(property);
  }

  public boolean hasSharedWorkspacesWithLoggedUser(UserEntity userEntity) {

    Set<Long> loggedUserWorkspaceIds = workspaceUserEntityController
        .listActiveWorkspaceEntitiesByUserEntity(sessionController.getLoggedUserEntity()).stream()
        .map(WorkspaceEntity::getId).collect(Collectors.toSet());

    Set<Long> studentWorkspaceIds = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(userEntity)
        .stream().map(WorkspaceEntity::getId).collect(Collectors.toSet());

    return !Collections.disjoint(loggedUserWorkspaceIds, studentWorkspaceIds);
  }
}
