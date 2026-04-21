package fi.otavanopisto.muikku.plugins.event;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventParticipantDAO;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventPropertyDAO;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventContainerDAO;
import fi.otavanopisto.muikku.plugins.event.dao.MuikkuEventDAO;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.EventAttendance;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventProperty;
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
  
  @Inject
  private MuikkuEventPropertyDAO muikkuEventPropertyDAO;
  
  public MuikkuEvent createEvent(OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, EventType type, Long userEntityId, boolean editableByUser, boolean isPrivate, boolean removableByUser, MuikkuEventContainer eventContainer) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.create(startDate, endDate, allDay, title, description, type, userEntityId, sessionController.getLoggedUserEntity().getId(), editableByUser, isPrivate, removableByUser, eventContainer);
  }
  
  public MuikkuEvent updateEvent(MuikkuEvent event, OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, EventType type, boolean editableByUser, boolean isPrivate, boolean removableByUser) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.update(event, startDate, endDate, allDay, title, description, type, editableByUser, isPrivate, removableByUser);
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
  
  public MuikkuEventContainer updateEventContainer(MuikkuEventContainer eventContainer, Long workspaceEntityId, Long userEntityId, String name) {
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
    } else {
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
  
  public List<MuikkuEvent> listByUserAndWorkspaceAndTimeframeAndType(Long userEntityId, Long workspaceEntityId, OffsetDateTime start, OffsetDateTime end, EventType type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return eventDAO.listByUserAndWorkspaceAndTimeframeAndType(userEntityId, workspaceEntityId, startDate, endDate, type);
  }
  
  private MuikkuEventParticipant findParticipantByUserEntityId(List<MuikkuEventParticipant> participants, Long userEntityId) {
    return participants.stream().filter(p -> userEntityId.equals(p.getUserEntityId())).findFirst().orElse(null);
  }

  private boolean hasContainerAccess(UserEntity userEntity) {
    boolean hasAccess = false;
    
    
    return hasAccess;
  }
  
  private boolean hasEventAccess(UserEntity userEntity, MuikkuEvent event) {
    boolean hasAccess = false;
    
    if (userEntity != null) {
      
      // Käyttäjällä aina oikeus päästä omiin eventteihin
      if (sessionController.getLoggedUserEntity() == userEntity) { // Kirjautunut käyttäjä on sama kuin käyttäjä jonka eventtiä halutaan tarkastella
        if (event.getUserEntityId() == sessionController.getLoggedUserEntity().getId()) { // Kirjautunut käyttäjä on sama kuin eventin kohde
          hasAccess = true;
        }
      }
      
      if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
        // Guardian
        if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT_PARENT)) {
          
        }
        
        // Staff member
        
      }
    }
    return hasAccess;
  }
  
  public List<MuikkuEventProperty> listPropertiesByEvent(MuikkuEvent event) {
    return muikkuEventPropertyDAO.listByEvent(event);
  }
  
  public MuikkuEventProperty createEventProperty(MuikkuEvent event, String name, String value, Long userEntityId, Date date) {
    return muikkuEventPropertyDAO.create(event, name, value, userEntityId, date);
  }
  
  public MuikkuEventProperty updateEventProperty(MuikkuEventProperty property, String name, String value, Long userEntityId, Date date) {
    return muikkuEventPropertyDAO.update(property, name, value, date);
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
}
