package fi.otavanopisto.muikku.plugins.calendar;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.calendar.dao.CalendarEventDAO;
import fi.otavanopisto.muikku.plugins.calendar.dao.CalendarEventParticipantDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventAttendance;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;
import fi.otavanopisto.muikku.session.SessionController;

public class CalendarController {
  
  @Inject
  private SessionController sessionController;

  @Inject
  private CalendarEventDAO calendarEventDAO;

  @Inject
  private CalendarEventParticipantDAO calendarEventParticipantDAO;
  
  public CalendarEvent createEvent(OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    return calendarEventDAO.create(startDate, endDate, allDay, title, description, visibility, type, userEntityId);
  }
  
  public CalendarEvent updateEvent(CalendarEvent event, OffsetDateTime start, OffsetDateTime end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return calendarEventDAO.update(event, startDate, endDate, allDay, title, description, visibility, type);
  }
  
  public void deleteEvent(CalendarEvent event) {
    List<CalendarEventParticipant> participants = calendarEventParticipantDAO.listByEvent(event);
    for (CalendarEventParticipant participant : participants) {
      calendarEventParticipantDAO.delete(participant);
    }
    calendarEventDAO.delete(event);
  }
  
  public void updateEventAttendance(CalendarEventParticipant participant, CalendarEventAttendance attendance) {
    calendarEventParticipantDAO.updateAttendance(participant, attendance);
  }
  
  public CalendarEvent findEventById(Long eventId) {
    return calendarEventDAO.findById(eventId);
  }
  
  public boolean isEventParticipant(CalendarEvent event, Long userEntityId) {
    return calendarEventParticipantDAO.findByEventAndParticipant(event, userEntityId) != null;
  }
  
  public void removeParticipant(CalendarEventParticipant participant) {
    calendarEventParticipantDAO.delete(participant);
  }
  
  public CalendarEventParticipant findParticipant(CalendarEvent event, Long userEntityId) {
    return calendarEventParticipantDAO.findByEventAndParticipant(event, userEntityId);
  }
  
  public List<CalendarEventParticipant> listParticipants(CalendarEvent event) {
    return calendarEventParticipantDAO.listByEvent(event);
  }
  
  /**
   * Sets the participants of an event. This method only adds and removes participants.
   * All new participants will have attendance UNCONFIRMED. All existing participants will
   * keep the attendance they currently have.   
   * 
   * @param event The event
   * @param participants The participants of the event
   */
  public void setParticipants(CalendarEvent event, List<CalendarEventParticipant> participants) {
    
    List<CalendarEventParticipant> oldParticipants = calendarEventParticipantDAO.listByEvent(event);
    
    // Add participants
    
    for (CalendarEventParticipant participant : participants) {
      CalendarEventParticipant oldParticipant = findParticipantByUserEntityId(oldParticipants, participant.getUserEntityId());
      if (oldParticipant == null) {
        calendarEventParticipantDAO.create(event, participant.getUserEntityId(), CalendarEventAttendance.UNCONFIRMED);
      }
    }
    
    // Remove participants
    
    for (CalendarEventParticipant oldParticipant : oldParticipants) {
      CalendarEventParticipant newParticipant = findParticipantByUserEntityId(participants, oldParticipant.getUserEntityId());
      if (newParticipant == null) {
        calendarEventParticipantDAO.delete(oldParticipant);
      }
    }
  }
  
  public List<CalendarEvent> listEventsByUserAndTimeframeAndType(Long userEntityId, OffsetDateTime start, OffsetDateTime end, String type) {
    Date startDate = new Date(start.toInstant().toEpochMilli());
    Date endDate = new Date(end.toInstant().toEpochMilli());
    return calendarEventDAO.listByUserAndTimeframeAndType(userEntityId, startDate, endDate, type);
  }
  
  private CalendarEventParticipant findParticipantByUserEntityId(List<CalendarEventParticipant> participants, Long userEntityId) {
    return participants.stream().filter(p -> userEntityId.equals(p.getUserEntityId())).findFirst().orElse(null);
  }

}
