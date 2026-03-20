package fi.otavanopisto.muikku.plugins.event;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventParticipantDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventContainerDAO;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventDAO;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.EventAttendance;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.EventType;
import fi.otavanopisto.muikku.session.SessionController;

public class MuikkuEventController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private MuikkuEventDAO eventDAO;

  @Inject
  private MuikkuEventContainerDAO eventContainerDAO;
  
  @Inject
  private MuikkuEventParticipantDAO eventParticipantDAO;
  
  public MuikkuEvent createEvent(OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, EventType type, Long userEntityId, boolean editableByUser, boolean isPrivate, boolean removableByUser, Long eventContainerId) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.create(startDate, endDate, allDay, title, description, type, userEntityId, sessionController.getLoggedUserEntity().getId(), editableByUser, isPrivate, removableByUser, eventContainerId);
  }
  
  public MuikkuEvent updateEvent(MuikkuEvent event, OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, EventType type, boolean editableByUser, boolean isPrivate, boolean removableByUser) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.update(event, startDate, endDate, allDay, title, description, type, editableByUser, isPrivate, removableByUser);
  }
  
  public void deleteEvent(MuikkuEvent event) {
    List<MuikkuEventParticipant> participants = eventParticipantDAO.listByEvent(event);
    for (MuikkuEventParticipant participant : participants) {
      eventParticipantDAO.delete(participant);
    }
    eventDAO.delete(event);
  }
  
  public MuikkuEventContainer createEventContainer(Long workspaceEntityId, Long userEntityId, String type, String name) {
    return eventContainerDAO.create(workspaceEntityId, userEntityId, type, name);
  }
  
  public MuikkuEventContainer updateEventContainer(MuikkuEventContainer eventContainer, Long workspaceEntityId, Long userEntityId, String type, String name) {
    return eventContainerDAO.update(eventContainer, workspaceEntityId, userEntityId, type, name);
  }
  
  public void updateEventAttendance(MuikkuEventParticipant participant, EventAttendance attendance) {
    eventParticipantDAO.updateAttendance(participant, attendance);
  }
  
  public MuikkuEvent findEventById(Long eventId) {
    return eventDAO.findById(eventId);
  }
  
  public MuikkuEventContainer findEventContainerByUserEntityId(Long userEntityId) {
    return eventContainerDAO.findByUser(userEntityId);
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
   * Sets the participants of an event. This method only adds and removes participants.
   * All new participants will have attendance UNCONFIRMED. All existing participants will
   * keep the attendance they currently have.   
   * 
   * @param event The event
   * @param participants The participants of the event
   */
  public void setParticipants(MuikkuEvent event, List<MuikkuEventParticipant> participants) {
    
    List<MuikkuEventParticipant> oldParticipants = eventParticipantDAO.listByEvent(event);
    
    // Add participants
    
    for (MuikkuEventParticipant participant : participants) {
      MuikkuEventParticipant oldParticipant = findParticipantByUserEntityId(oldParticipants, participant.getUserEntityId());
      if (oldParticipant == null) {
        eventParticipantDAO.create(event, participant.getUserEntityId(), EventAttendance.UNCONFIRMED);
      }
    }
    
    // Remove participants
    
    for (MuikkuEventParticipant oldParticipant : oldParticipants) {
      MuikkuEventParticipant newParticipant = findParticipantByUserEntityId(participants, oldParticipant.getUserEntityId());
      if (newParticipant == null) {
        eventParticipantDAO.delete(oldParticipant);
      }
    }
  }
  
  public List<MuikkuEvent> listEventsByUserAndTimeframeAndType(Long userEntityId, OffsetDateTime start, OffsetDateTime end, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.listByUserAndTimeframeAndType(userEntityId, startDate, endDate, type);
  }
  
  private MuikkuEventParticipant findParticipantByUserEntityId(List<MuikkuEventParticipant> participants, Long userEntityId) {
    return participants.stream().filter(p -> userEntityId.equals(p.getUserEntityId())).findFirst().orElse(null);
  }

}
